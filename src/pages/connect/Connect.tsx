import Header from "@/components/common/Header";
import { Input } from "@/components/ui/input";
import { Pin, Bookmark } from "lucide-react";
import NewAccountButton from "@/components/dashboard/new-account/NewAccountButton";
import useAccount, { ExtendedWalletRecord } from "@/stores/useAccount";
import CardWallet from "./CardWallet";
import { removeVisibleModifier, useGetWalletCreated } from "zerosecurehq-sdk";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import CardWalletSkeleton from "./CardWalletSkeleton";
import useToken from "@/stores/useToken";

const Connect = () => {
  const {
    wallets,
    pinnedWallets,
    togglePinnedWallet,
    selectedWallet,
    publicKey,
  } = useAccount();
  const { setWalletAddressToGetToken } = useToken();
  const { isProcessing, reset } = useGetWalletCreated();
  const [search, setSearch] = useState<string>("");
  const [filteredWallets, setFilteredWallets] = useState<
    ExtendedWalletRecord[]
  >([]);
  const [filteredPinnedWallets, setFilteredPinnedWallets] = useState<
    ExtendedWalletRecord[]
  >([]);

  const selectedInSearch = (() => {
    if (!publicKey || !selectedWallet) return false;
    const rawName = localStorage.getItem("name") || "{}";
    const parsedName = JSON.parse(rawName);
    const address = removeVisibleModifier(selectedWallet.data.wallet_address);
    const name = parsedName?.[address];
    if (search.trim() === "") return true;
    return name.toLowerCase().includes(search.toLowerCase());
  })();

  useEffect(() => {
    if (!publicKey) {
      setFilteredWallets([]);
      setFilteredPinnedWallets([]);
      return;
    }
  }, [publicKey]);

  useEffect(() => {
    if (selectedWallet) {
      setWalletAddressToGetToken(
        removeVisibleModifier(selectedWallet.data.wallet_address)
      );
    }
  }, [selectedWallet]);

  useEffect(() => {
    if (!publicKey) {
      return;
    }
    const storedNames = localStorage.getItem("name");
    const parsedNames = storedNames
      ? (JSON.parse(storedNames) as Record<string, string>)
      : {};
    const filteredWallets = wallets.filter((wallet) => {
      const walletName =
        parsedNames[removeVisibleModifier(wallet.data.wallet_address)] || "";
      return (
        search === "" || walletName.toLowerCase().includes(search.toLowerCase())
      );
    });
    const filteredPinnedWallets = pinnedWallets.filter((wallet) => {
      const walletName =
        parsedNames[removeVisibleModifier(wallet.data.wallet_address)] || "";
      return (
        search === "" || walletName.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilteredPinnedWallets(filteredPinnedWallets);
    setFilteredWallets(filteredWallets);
  }, [search, wallets, pinnedWallets, publicKey]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="mt-16 p-4">
          <div className="max-w-3xl mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="w-52 h-8 rounded-full" />
              <Skeleton className="w-36 h-8" />
            </div>

            {/* Search + Sort */}
            <div className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow">
              <div className="w-full flex items-center justify-between">
                <Skeleton className="w-[500px] h-8" />
                <Skeleton className="w-32 h-5 rounded-full" />
              </div>

              <div>
                <Skeleton className="w-20 h-5 rounded-full mb-2" />
                <div className="border border-dashed border-gray-300 p-2 rounded-lg space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <CardWalletSkeleton key={i} />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Skeleton className="w-20 h-5 rounded-full mb-2" />
              </div>

              <div>
                <Skeleton className="w-20 h-5 rounded-full mb-2" />
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <CardWalletSkeleton key={i} />
                  ))}
                </div>
              </div>
            </div>

            {/* Import Safe */}
            <div className="mt-6 flex flex-col items-center gap-4">
              <div>
                <Skeleton className="w-96 h-5 rounded-full mb-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="mt-16 p-4">
        <div className="max-w-3xl mx-auto py-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My accounts</h1>
            <div className="flex gap-4">
              {publicKey && <NewAccountButton reset={reset} />}
            </div>
          </div>

          {/* Search + Sort */}
          <div className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <Input
                placeholder="Search your wallet name"
                className="w-full md:w-2/3"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="text-gray-500 text-sm self-center">
                Sort by: Most recent
              </div>
            </div>

            {/* Pinned */}
            <div>
              <h2 className="mb-2 flex items-center">
                <Bookmark className="mr-1" size={18} />
                <span className="text font-medium">Pinned</span>
              </h2>
              <div className="border border-dashed border-gray-300 p-2 text-gray-500 text-center rounded-lg space-y-2">
                {filteredPinnedWallets.length > 0 ? (
                  <>
                    {selectedWallet &&
                      selectedInSearch &&
                      filteredPinnedWallets.some(
                        (w) =>
                          w.data.wallet_address ===
                          selectedWallet.data.wallet_address
                      ) && (
                        <CardWallet
                          key={selectedWallet.data.wallet_address}
                          wallet={selectedWallet}
                          isPinned={true}
                          togglePin={() => togglePinnedWallet(selectedWallet)}
                        />
                      )}
                    {filteredPinnedWallets
                      .filter(
                        (wallet) =>
                          !selectedWallet ||
                          wallet.data.wallet_address !==
                            selectedWallet.data.wallet_address
                      )
                      .map((wallet) => (
                        <CardWallet
                          key={wallet.data.wallet_address}
                          wallet={wallet}
                          isPinned={true}
                          togglePin={() => togglePinnedWallet(wallet)}
                        />
                      ))}
                  </>
                ) : (
                  <div className="border border-dashed border-gray-300 p-6 text-gray-500 text-center rounded-lg flex items-center justify-center">
                    Personalize your account list by clicking the{" "}
                    <Pin className="mx-1" size={18} /> icon on the accounts most
                    important to you.
                  </div>
                )}
              </div>
            </div>

            {/* Wallet List */}
            <div className="flex items-center gap-2 cursor-pointer">
              <span className="font-medium">Accounts</span>
            </div>

            <div className="space-y-2">
              {filteredWallets.length > 0 ? (
                <>
                  {selectedWallet &&
                  selectedInSearch &&
                  !filteredPinnedWallets.some(
                    (w) =>
                      w.data.wallet_address ===
                      selectedWallet.data.wallet_address
                  ) ? (
                    <CardWallet
                      key={selectedWallet.data.wallet_address}
                      wallet={selectedWallet}
                      isPinned={false}
                      togglePin={() => togglePinnedWallet(selectedWallet)}
                    />
                  ) : (
                    ""
                  )}
                  {filteredWallets
                    .filter(
                      (wallet) =>
                        wallet.data.wallet_address !==
                          selectedWallet?.data.wallet_address &&
                        !filteredPinnedWallets.some(
                          (pinned) =>
                            pinned.data.wallet_address ===
                            wallet.data.wallet_address
                        )
                    )
                    .map((wallet) => (
                      <CardWallet
                        key={wallet.data.wallet_address}
                        wallet={wallet}
                        isPinned={false}
                        togglePin={() => togglePinnedWallet(wallet)}
                      />
                    ))}
                </>
              ) : (
                ""
              )}
            </div>

            {/* Connect Wallet */}
            {filteredWallets.length === 0 &&
              (!publicKey ? (
                <div className="text-center space-y-4">
                  <p className="text-gray-500">
                    Connect your wallet to view and manage your accounts.
                  </p>
                  {/* <Button className="flex items-center gap-2 mx-auto">
                    <Wallet size={16} /> Connect a wallet
                  </Button> */}
                </div>
              ) : (
                <div>
                  <p className="font-bold text-center">
                    There was no multisig wallet found.
                  </p>
                  <p className="text-center text-gray-500 py-2">
                    Create a new multisig wallet to get started.
                  </p>
                </div>
              ))}
          </div>

          {/* Import Safe */}
          <div className="mt-6 flex flex-col items-center gap-4">
            <p className="text-gray-600 text-sm font-bold">
              Powered by ZeroSecure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connect;
