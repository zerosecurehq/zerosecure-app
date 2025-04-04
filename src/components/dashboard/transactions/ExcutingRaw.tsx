import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import useAccount from "@/stores/useAccount";
import { WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ExecuteTicketRecord,
  getCurrentTransactionConfirmations,
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
    <TableRow className="text-center relative">
      <TableCell className="font-medium">{data.data.to}</TableCell>
      <TableCell>{data.data.amount}</TableCell>
      {/* @TODO check field time */}
      <TableCell>{data.data.transfer_id}</TableCell>
      <TableCell>
        <Button
          variant={"outline"}
          onClick={() => handleApplyExcute(data)}
          disabled={isProcessing}
        >
          {isProcessing ? <Loader2 className="animate-spin" /> : "Excute"}
        </Button>
      </TableCell>
      {confirmed !==
      parseInt((selectedWallet?.data.threshold || "0").toString()) ? (
        <Badge
          variant={"outline"}
          className="absolute top-1/2 -translate-y-1/2 right-0 rounded-full"
        >
          {`${confirmed}/${parseInt(
            (selectedWallet?.data.threshold || "0").toString()
          )}`}
        </Badge>
      ) : (
        <Badge
          variant={"outline"}
          className="absolute top-1/2 -translate-y-1/2 right-0 rounded-full bg-gradient-primary text-white"
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
