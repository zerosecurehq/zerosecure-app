import { Card } from "@/components/ui/card";
import useAccount, { WalletRecordData } from "@/stores/useAccount";
import { formatAleoAddress, getBalanceMultiWallet } from "@/utils";
import { WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import { Pin, Trash2, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { removeVisibleModifier } from "zerosecurehq-sdk";

const CardWallet = ({
  wallet,
  isPinned,
  togglePin,
}: {
  wallet: WalletRecordData;
  isPinned: boolean;
  togglePin: () => void;
}) => {
  const { setSelectedWallet, selectedWallet } = useAccount();
  const [balanceMultiWallet, setBalanceMultiWallet] = useState(0);
  useEffect(() => {
    const getBalance = async () => {
      const result = await getBalanceMultiWallet(
        WalletAdapterNetwork.TestnetBeta,
        wallet!.data.wallet_address
      );
      setBalanceMultiWallet(result);
    };
    getBalance();
  }, []);

  return (
    <Card
      key={wallet.data.wallet_address}
      className={`p-4 border rounded-xl shadow-md  hover:shadow-lg transition-shadow ${
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
            <p className="text-gray-500 text-sm">${balanceMultiWallet}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
    </Card>
  );
};

export default CardWallet;
