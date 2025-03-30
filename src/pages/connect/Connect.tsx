import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, Pin, Bookmark } from "lucide-react";
import NewAccountButton from "@/components/dashboard/new-account/NewAccountButton";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import useAccount from "@/stores/useAccount";
import CardWallet from "./CardWallet";
import { useGetWalletCreated } from "zerosecurehq-sdk";
import { useEffect } from "react";

const Connect = () => {
  const { publicKey } = useWallet();
  const { wallets, pinnedWallets, togglePinnedWallet, setWallets } =
    useAccount();
  const { getWalletCreated } = useGetWalletCreated();

  useEffect(() => {
    const fetchWallets = async () => {
      if (wallets.length === 0) {
        const newWallets = await getWalletCreated();
        if (newWallets) setWallets(newWallets);
      }
    };
    if (publicKey) {
      fetchWallets();
    }
  }, [wallets.length, setWallets, getWalletCreated, publicKey]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="mt-16">
        <div className="max-w-3xl mx-auto py-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My accounts</h1>
            <div className="flex gap-4">
              {publicKey && <NewAccountButton />}
            </div>
          </div>

          {/* Search + Sort */}
          <div className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <Input
                placeholder="Search your wallet name"
                className="w-full md:w-2/3"
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
                {pinnedWallets.length > 0 ? (
                  pinnedWallets.map((wallet) => (
                    <CardWallet
                      key={wallet.data.wallet_address}
                      wallet={wallet}
                      isPinned={true}
                      togglePin={() => togglePinnedWallet(wallet)}
                    />
                  ))
                ) : (
                  <div>
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
              {wallets
                ?.filter(
                  (wallet) =>
                    !pinnedWallets.some(
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
            </div>

            {/* Connect Wallet */}
            {wallets.length === 0 && (
              <div className="text-center py-6 space-y-4">
                <p>
                  Connect a wallet to view your Safe Accounts or to create a new
                  one
                </p>
                <Button className="flex items-center gap-2 mx-auto">
                  <Wallet size={16} /> Connect a wallet
                </Button>
              </div>
            )}
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
