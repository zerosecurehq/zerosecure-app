import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import useAccount from "@/stores/useAccount";
import { formatAleoAddress, microCreditsToCredits } from "@/utils";
import { WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  CREDITS_TOKEN_ID,
  ExecuteTicketRecord,
  getCurrentTransactionConfirmations,
  removeVisibleModifier,
  useApplyExecuteTicket,
} from "zerosecurehq-sdk";

interface ExecutingRowProps {
  data: ExecuteTicketRecord;
  getExcute: () => void;
}

const ExecutingRow = ({ data, getExcute }: ExecutingRowProps) => {
  const {
    applyExecuteTicket,
    error,
    isProcessing,
    reset: resetExcute,
  } = useApplyExecuteTicket();
  const { selectedWallet } = useAccount();
  const [confirmed, setConfirmed] = useState(0);

  useEffect(() => {
    if (error) {
      toast.error(`Error excute: ${error.message}`);
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
      toast.error("Transaction executed successfully");
      resetExcute();
      getExcute();
    }
  };

  let isCreditsTransaction =
    removeVisibleModifier(data.data.token_id) === CREDITS_TOKEN_ID;

  return (
    <TableRow className="text-center relative cursor-pointer">
      <TableCell className="font-medium">
        {formatAleoAddress(removeVisibleModifier(data.data.to))}
      </TableCell>
      <TableCell>
        {microCreditsToCredits(parseInt(data.data.amount))}{" "}
        {isCreditsTransaction ? "credits" : "tokens"}
      </TableCell>
      <TableCell>
        {/* @TODO (need backend) transaction creation time cant not be obtained from local wallet, will need database for it*/}
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
      {confirmed <
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

export default ExecutingRow;
