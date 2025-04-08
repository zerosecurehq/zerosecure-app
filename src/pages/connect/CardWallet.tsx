import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import useAccount, { WalletRecordData } from "@/stores/useAccount";
import { formatAleoAddress, getBalanceMultiWallet } from "@/utils";
import { WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import { Pin, Trash2, MoreHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";
import { removeVisibleModifier } from "zerosecurehq-sdk";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export const ZERO_ADDRESS =
  "aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc";

const CardWallet = ({
  wallet,
  isPinned,
  togglePin,
}: {
  wallet: WalletRecordData;
  isPinned: boolean;
  togglePin: () => void;
}) => {
  const { setSelectedWallet, selectedWallet, publicKey } = useAccount();
  const [balanceMultiWallet, setBalanceMultiWallet] = useState(0);
  const [walletName, setWalletName] = useState("");
  const [newWalletName, setNewWalletName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const getBalance = async () => {
      const result = await getBalanceMultiWallet(
        WalletAdapterNetwork.TestnetBeta,
        wallet!.data.wallet_address
      );
      setBalanceMultiWallet(result);
    };
    getBalance();
  }, [wallet]);

  useEffect(() => {
    if (publicKey) {
      try {
        const storedData = localStorage.getItem("name");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setWalletName(
            parsedData[
              `${removeVisibleModifier(
                wallet.data.wallet_address
              )}:${publicKey}`
            ] || ""
          );
        } else {
          setWalletName("");
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        setWalletName("");
      }
    }
  }, [publicKey]);

  const handleSaveName = () => {
    if (publicKey && newWalletName) {
      const storedData = localStorage.getItem("name");
      let parsedData: Record<string, string> = {};
      if (storedData) {
        parsedData = JSON.parse(storedData);
      }

      parsedData[
        `${removeVisibleModifier(wallet.data.wallet_address)}:${publicKey}`
      ] = newWalletName;
      localStorage.setItem("name", JSON.stringify(parsedData));

      setWalletName(newWalletName);
      setIsDialogOpen(false);
    }
  };

  const numberOfSigners = wallet.data.owners.filter(
    (owner) => removeVisibleModifier(owner) !== ZERO_ADDRESS
  ).length;

  return (
    <Card
      key={wallet.data.wallet_address}
      className={`p-4 border rounded-xl shadow-md hover:shadow-lg transition-shadow ${
        selectedWallet?.data?.wallet_address === wallet.data.wallet_address
          ? "opacity-60"
          : "cursor-pointer bg-white"
      }`}
      onClick={() => setSelectedWallet(wallet)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 rounded-lg ${wallet?.avatar}`} />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">
              {formatAleoAddress(
                removeVisibleModifier(wallet.data.wallet_address)
              )}
            </span>
            <p className="text-gray-500 text-sm text-left">
              ${balanceMultiWallet}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            onClick={(e) => {
              e.stopPropagation();
              setIsDialogOpen(true);
            }}
          >
            {walletName || "Wallet Name"}
          </Badge>
          <Badge>
            {parseInt(wallet.data.threshold as unknown as string)}/
            {numberOfSigners}
          </Badge>

          {isPinned ? (
            <Trash2
              className="text-red-500 hover:text-red-700 cursor-pointer"
              size={20}
              onClick={(e) => {
                e.stopPropagation();
                togglePin();
              }}
            />
          ) : (
            <Pin
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
              size={20}
              onClick={(e) => {
                e.stopPropagation();
                togglePin();
              }}
            />
          )}

          <MoreHorizontal
            className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors duration-200"
            size={22}
          />
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle>Edit Wallet Name</DialogTitle>
          <input
            type="text"
            value={newWalletName}
            onChange={(e) => setNewWalletName(e.target.value)}
            className="border p-2 rounded-md"
            placeholder="Enter new wallet name"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSaveName();
            }}
            className="bg-blue-500 text-white p-2 rounded-md mt-2"
          >
            Save
          </button>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CardWallet;
