import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import useAccount from "@/stores/useAccount";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  ConfirmTransferTicketRecord,
  useApplyConfirmTransferTicket,
} from "zerosecurehq-sdk";

interface SigningRawProps {
  data: ConfirmTransferTicketRecord;
  getSigning: () => void;
}

const SigningRaw = ({ data, getSigning }: SigningRawProps) => {
  const {
    applyConfirmTransferTicket,
    error,
    isProcessing,
    reset: resetConfirm,
    txId,
  } = useApplyConfirmTransferTicket();
  const { selectedWallet } = useAccount();

  useEffect(() => {
    if (error) {
      toast(`Error confirm ${error.message}`);
      resetConfirm();
    }
  }, [error]);

  const handleApplyConfirm = async (
    dataConfirm: ConfirmTransferTicketRecord
  ) => {
    const txHash = await applyConfirmTransferTicket(dataConfirm);
    if (txHash) {
      resetConfirm();
      getSigning();
      toast("Transaction signed successfully");
    }
  };

  return (
    <TableRow className="text-center relative">
      <TableCell className="font-medium">{data?.data.to}</TableCell>
      <TableCell>{data?.data.amount}</TableCell>
      {/* @TODO check field time */}
      <TableCell>{data?.data.transfer_id}</TableCell>
      <TableCell>
        <Button
          variant={"outline"}
          onClick={() => handleApplyConfirm(data)}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Sign Transaction"
          )}
        </Button>
      </TableCell>
      <Badge
        variant={"outline"}
        className="absolute top-1/2 right-0 -translate-y-1/2 rounded-full"
      >
        {parseInt((selectedWallet?.data.threshold || "").toString()) +
          "/" +
          selectedWallet?.data.owners.filter(
            (item) =>
              item !==
              "aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc.private"
          ).length}
      </Badge>
    </TableRow>
  );
};

export default SigningRaw;
