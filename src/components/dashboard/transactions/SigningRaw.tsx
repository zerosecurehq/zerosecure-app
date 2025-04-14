import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import useAccount from "@/stores/useAccount";
import { formatAleoAddress } from "@/utils";
import { WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import { Loader2 } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ConfirmTransferTicketRecord,
  getCurrentTransactionConfirmations,
  removeVisibleModifier,
  useApplyConfirmTransferTicket,
} from "zerosecurehq-sdk";

interface SigningRawProps {
  data: ConfirmTransferTicketRecord;
  getSigning: () => void;
  setSigning: Dispatch<SetStateAction<ConfirmTransferTicketRecord[]>>;
}

const SigningRaw = ({ data, getSigning, setSigning }: SigningRawProps) => {
  const {
    applyConfirmTransferTicket,
    error,
    isProcessing,
    reset: resetConfirm,
  } = useApplyConfirmTransferTicket();
  const [confirmed, setConfirmed] = useState(0);
  const { selectedWallet } = useAccount();

  const getConfirmed = async () => {
    const result = await getCurrentTransactionConfirmations(
      WalletAdapterNetwork.TestnetBeta,
      data.data.transfer_id
    );
    if (result !== undefined || result !== null) {
      setConfirmed(result);
    }
  };

  useEffect(() => {
    if (selectedWallet) {
      getConfirmed();
    }
  }, [selectedWallet]);

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
    const signed = JSON.parse(
      localStorage.getItem("signedTransactions") || "[]"
    );
    if (!signed.includes(dataConfirm.id)) {
      signed.push(dataConfirm.id);
      localStorage.setItem("signedTransactions", JSON.stringify(signed));
    }
    setSigning((state) =>
      state.filter(
        (item) => item.data.wallet_address !== dataConfirm.data.wallet_address
      )
    );
    if (txHash) {
      resetConfirm();
      getSigning();
      toast("Transaction signed successfully");
    }
  };

  return (
    <TableRow className="text-center relative cursor-pointer">
      <TableCell className="font-medium">
        {formatAleoAddress(data.data.to)}
      </TableCell>
      <TableCell>{removeVisibleModifier(data.data.amount)}</TableCell>
      <TableCell>
        {/* @TODO (need backend) transaction creation time cant not be obtained from local wallet, will need database for it*/}
        {new Date(Date.now()).toLocaleString()}
      </TableCell>
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
        className="absolute top-1/2 right-0 -translate-y-1/2 rounded-full mr-2"
      >
        {confirmed}/
        {parseInt((selectedWallet?.data.threshold || "").toString())}
      </Badge>
    </TableRow>
  );
};

export default SigningRaw;
