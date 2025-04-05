import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import useAccount from "@/stores/useAccount";
import { formatAleoAddress } from "@/utils";
import { WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ExecuteTicketRecord,
  getCurrentTransactionConfirmations,
  removeVisibleModifier,
  useApplyExecuteTicket,
} from "zerosecurehq-sdk";

interface ExcutingRawProps {
  data: ExecuteTicketRecord;
  getExcute: () => void;
}

const ExcutingRaw = ({ data, getExcute }: ExcutingRawProps) => {
  const {
    applyExecuteTicket,
    error,
    isProcessing,
    reset: resetExcute,
    txId: txIdExcute,
  } = useApplyExecuteTicket();
  const { selectedWallet } = useAccount();
  const [confirmed, setConfirmed] = useState(0);

  useEffect(() => {
    if (error) {
      toast(`Error excute: ${error.message}`);
      resetExcute();
    }
  }, [error]);

  useEffect(() => {
    if (selectedWallet) {
      getConfirmed();
    }
  }, []);

  const getConfirmed = async () => {
    const result = await getCurrentTransactionConfirmations(
      WalletAdapterNetwork.TestnetBeta,
      data.data.transfer_id
    );
    if (result !== undefined || result !== null) {
      setConfirmed(result);
    }
  };

  const handleApplyExcute = async (dataExcute: ExecuteTicketRecord) => {
    const txHash = await applyExecuteTicket(dataExcute);
    if (txHash) {
      toast("Transaction excuted successfully");
      resetExcute();
      getExcute();
    }
  };

  return (
    <TableRow className="text-center relative cursor-pointer">
      <TableCell className="font-medium">
        {formatAleoAddress(data.data.to)}
      </TableCell>
      <TableCell>{removeVisibleModifier(data.data.amount)}</TableCell>
      <TableCell>
        {/* @TODO transaction creation time cant not be obtained from local wallet, will need database for it*/}
        {new Date(Date.now()).toLocaleString()}
      </TableCell>
      <TableCell>
        <Button
          variant={"outline"}
          onClick={() => handleApplyExcute(data)}
          disabled={isProcessing}
        >
          {isProcessing ? <Loader2 className="animate-spin" /> : "Excute"}
        </Button>
      </TableCell>{" "}
      {confirmed !==
      parseInt((selectedWallet?.data.threshold || "0").toString()) ? (
        <Badge
          variant={"outline"}
          className="absolute top-1/2 -translate-y-1/2 right-0 rounded-full mr-2"
        >
          {`${confirmed}/${parseInt(
            (selectedWallet?.data.threshold || "0").toString()
          )}`}
        </Badge>
      ) : (
        <Badge
          variant={"outline"}
          className="absolute top-1/2 -translate-y-1/2 right-0 rounded-full bg-gradient-primary text-white mr-2"
        >
          {`${confirmed}/${parseInt(
            (selectedWallet?.data.threshold || "0").toString()
          )}`}
        </Badge>
      )}
    </TableRow>
  );
};

export default ExcutingRaw;
