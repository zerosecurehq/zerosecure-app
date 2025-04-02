import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, Pin, Bookmark } from "lucide-react";
import NewAccountButton from "@/components/dashboard/new-account/NewAccountButton";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import useAccount, { WalletRecordData } from "@/stores/useAccount";
import CardWallet from "./CardWallet";
import { useGetWalletCreated } from "zerosecurehq-sdk";
import { useEffect } from "react";

const dataTest: WalletRecordData[] = [
  {
    id: "a1b2c3d4-e5f6-7g8h-9i10-j11k12l13m14",
    spent: false,
    recordName: "Wallet",
    name: "Personal Wallet",
    owner: "aleo1ownerxyz1234567890abcdefghijklmnopqrstuv",
    program_id: "zerosecure_v2.aleo",
    data: {
      wallet_address: "aleo1xyzabc1234567890abcdefghijklmnopqrstuv.private",
      owners: ["aleo1ownerxyz1234567890abcdefghijklmnopqrstuv.private"],
      threshold: 1,
    },
    avatar: "bg-gradient-to-r from-blue-500 to-green-500",
  },
  {
    id: "b2c3d4e5-f6g7-h8i9-j10k11-l12m13n14o15",
    spent: true,
    recordName: "Wallet",
    name: "Savings Wallet",
    owner: "aleo1ownerxyz9876543210lkjihgfedcba",
    program_id: "credits.aleo",
    data: {
      wallet_address: "aleo1mnopqrstu1234567890vwxyzabcdefghijkl.private",
      owners: ["aleo1ownerxyz9876543210lkjihgfedcba.private"],
      threshold: 2,
    },
    avatar: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    id: "c3d4e5f6-g7h8-i9j10-k11l12-m13n14o15p16",
    spent: false,
    recordName: "Wallet",
    name: "Investment Wallet",
    owner: "aleo1ownerxyz0987654321zyxwvutsrqponmlk",
    program_id: "aleo_multisig_v5.aleo",
    data: {
      wallet_address: "aleo1abcdefghijk1234567890lmnopqrstuvwxyz.private",
      owners: ["aleo1ownerxyz0987654321zyxwvutsrqponmlk.private"],
      threshold: 3,
    },
    avatar: "bg-gradient-to-r from-red-500 to-yellow-500",
  },
  {
    id: "d4e5f6g7-h8i9-j10k11-l12m13-n14o15p16q17",
    spent: true,
    recordName: "Wallet",
    name: "Shared Wallet",
    owner: "aleo1ownerxyz5678901234lkjihgfedcba",
    program_id: "dApp_1_test.aleo",
    data: {
      wallet_address: "aleo1zxcvbnmasdfghjklqwertyuiop0987654321.private",
      owners: ["aleo1ownerxyz5678901234lkjihgfedcba.private"],
      threshold: 1,
    },
    avatar: "bg-gradient-to-r from-indigo-500 to-purple-500",
  },
];

const Connect = () => {
  const { publicKey } = useWallet();
  const { wallets, pinnedWallets, togglePinnedWallet, selectedWallet } =
    useAccount();
  const { resetAccount, setWallets, setPublicKey } = useAccount();
  const { getWalletCreated } = useGetWalletCreated();

  const fetchWallets = async () => {
    // setWallets(dataTest);
    const newWallets = await getWalletCreated();
    if (newWallets) {
      console.log("Fetched wallets:", newWallets);
      setWallets(newWallets);
    }
  };

  useEffect(() => {
    if (!publicKey) {
      resetAccount();
      return;
    }
    setPublicKey(publicKey);
    fetchWallets();
  }, [publicKey]);

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
                  <>
                    {selectedWallet &&
                      pinnedWallets.some(
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
                    {pinnedWallets
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
              {selectedWallet &&
                !pinnedWallets.some(
                  (w) =>
                    w.data.wallet_address === selectedWallet.data.wallet_address
                ) && (
                  <CardWallet
                    key={selectedWallet.data.wallet_address}
                    wallet={selectedWallet}
                    isPinned={false}
                    togglePin={() => togglePinnedWallet(selectedWallet)}
                  />
                )}
              {wallets
                .filter(
                  (wallet) =>
                    wallet.data.wallet_address !==
                      selectedWallet?.data.wallet_address &&
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
