import { Card } from "@/components/ui/card";
import useAccount, { WalletRecordData } from "@/stores/useAccount";
import { convertKey } from "@/utils";
import { Pin, Trash2, MoreHorizontal } from "lucide-react";

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
  return (
    <Card
      key={wallet.data.wallet_address}
      className={`p-4 border rounded-xl shadow-md  hover:shadow-lg transition-shadow ${selectedWallet?.data?.wallet_address === wallet.data.wallet_address ? "pointer-events-none opacity-60" : "cursor-pointer bg-white"}`}
      onClick={() => setSelectedWallet(wallet)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 rounded-lg ${wallet?.avatar}`} />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 truncate max-w-[160px]">
              {convertKey(wallet.data.wallet_address)}
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
