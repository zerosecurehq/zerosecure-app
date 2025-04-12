import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import useAccount from "@/stores/useAccount";
import {
  enoughComfirm,
  getAddedOwners,
  getRemovedOwners,
  network,
} from "@/utils";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  ConfirmChangeGovernanceTicketRecord,
  getCurrentTransactionConfirmations,
  removeVisibleModifier,
  useApplyConfirmChangeGovernanceTicket,
  useApplyExecuteChangeGovernanceTicket,
  ZERO_ADDRESS,
} from "zerosecurehq-sdk";

interface GovernanceCardProps {
  data: ConfirmChangeGovernanceTicketRecord;
  getGovernanceConfirm: () => Promise<void>;
  getGovernanceExecute: () => Promise<void>;
}

const GovernanceCard = ({
  data,
  getGovernanceConfirm,
  getGovernanceExecute,
}: GovernanceCardProps) => {
  const { selectedWallet } = useAccount();
  const {
    applyConfirmChangeGovernanceTicket,
    error: errorConfirm,
    isProcessing: isProcessingConfirm,
    reset: resetConfirm,
  } = useApplyConfirmChangeGovernanceTicket();
  const {
    applyExecuteChangeGovernanceTicket,
    error: errorExecute,
    isProcessing: isProcessingExecute,
    reset: resetExecute,
  } = useApplyExecuteChangeGovernanceTicket();
  const [confirmed, setConfirmed] = useState(0);

  useEffect(() => {
    if (errorConfirm) {
      toast(`Error confirm governance ${errorConfirm.message}`);
      resetConfirm();
    }
    if (errorExecute) {
      toast(`Error execute governance ${errorExecute.message}`);
      resetExecute();
    }
  }, [errorConfirm, errorExecute]);

  const getGovernanceConfirmed = async () => {
    const result = await getCurrentTransactionConfirmations(
      network,
      data.data.request_id
    );
    if (result !== undefined || result !== null) {
      setConfirmed(result);
    }
  };

  useEffect(() => {
    if (selectedWallet && data) {
      getGovernanceConfirmed();
    }
  }, [data, selectedWallet]);

  if (!selectedWallet) return null;

  const clean = (list: string[]) =>
    list
      .map((addr) =>
        removeVisibleModifier(addr) !== ZERO_ADDRESS ? addr : undefined
      )
      .filter((addr): addr is string => addr !== undefined);

  const cleanedNew = clean(data.data.new_owners);
  const cleanedOld = clean(selectedWallet.data.owners);

  const addCount = getAddedOwners(cleanedNew, cleanedOld);
  const removeCount = getRemovedOwners(cleanedNew, cleanedOld);

  const isEnough = enoughComfirm(confirmed.toString(), data.data.new_threshold);

  const handleConfirmGovernance = async () => {
    if (!selectedWallet) return;
    const txIdHash = await applyConfirmChangeGovernanceTicket(data);
    if (txIdHash) {
      toast.success("Governance confirmed");
      resetConfirm();
      getGovernanceConfirm();
      getGovernanceExecute();
    }
  };

  const handleExcuteGovernence = async () => {
    if (!selectedWallet) return;
    const txIdHash = await applyExecuteChangeGovernanceTicket(data);
    if (txIdHash) {
      toast.success("Governance excuted");
      resetExecute();
      getGovernanceExecute();
      getGovernanceConfirm();
    }
  };

  return (
    <TableRow className="text-center relative cursor-pointer">
      <TableCell>{`Add(+${addCount}) | Remove(-${removeCount})`}</TableCell>
      <TableCell>{parseInt(data.data.new_threshold)}</TableCell>
      {/* @TODO add date */}
      <TableCell>{data.data.sequence}</TableCell>
      <TableCell>
        <Button
          variant={"outline"}
          onClick={isEnough ? handleExcuteGovernence : handleConfirmGovernance}
          disabled={isProcessingConfirm || isProcessingExecute}
        >
          {isProcessingConfirm || isProcessingExecute ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <>{isEnough ? "Execute" : "Agree"}</>
          )}
        </Button>
      </TableCell>
      <Badge
        className="absolute top-1/2 right-0 -translate-y-1/2 rounded-full mr-2"
        variant={"outline"}
      >
        {confirmed}/{parseInt(data.data.old_threshold)}
      </Badge>
    </TableRow>
  );
};

export default GovernanceCard;
