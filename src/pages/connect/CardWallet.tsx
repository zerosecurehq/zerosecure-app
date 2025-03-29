import { Card } from "@/components/ui/card";
import useAccount from "@/stores/useAccount";
import { Pin, Trash2, MoreHorizontal } from "lucide-react";
import { WalletRecord } from "zerosecurehq-sdk";

const CardWallet = ({
  wallet,
  isPinned,
  togglePin,
}: {
  wallet: WalletRecord;
  isPinned: boolean;
  togglePin: () => void;
}) => {
  const { setSelectedWallet } = useAccount();
  return (
    <Card
      key={wallet.data.wallet_address}
      className="p-4 border rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => setSelectedWallet(wallet)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500" />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 truncate max-w-[160px]">
              {wallet.data.wallet_address}
            </span>
            <p className="text-gray-500 text-sm">$20.21 Aleo</p>
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
