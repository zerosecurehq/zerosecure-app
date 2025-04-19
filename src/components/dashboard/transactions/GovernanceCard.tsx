import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import useAccount from "@/stores/useAccount";
import { getAddedOwners, getRemovedOwners, network } from "@/utils";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  ConfirmChangeGovernanceTicketRecord,
  ExecuteChangeGovernanceTicketRecord,
  getCurrentGovernanceChangeConfirmations,
  removeVisibleModifier,
  useApplyConfirmChangeGovernanceTicket,
  useApplyExecuteChangeGovernanceTicket,
  ZERO_ADDRESS,
} from "zerosecurehq-sdk";

interface GovernanceCardProps {
  data:
    | ConfirmChangeGovernanceTicketRecord
    | ExecuteChangeGovernanceTicketRecord;
  type: "confirm" | "execute";
  getGovernanceConfirm: () => Promise<void>;
  getGovernanceExecute: () => Promise<void>;
}

const GovernanceCard = ({
  data,
  type,
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
      toast.error(`Error confirm governance ${errorConfirm.message}`);
      resetConfirm();
    }
    if (errorExecute) {
      toast.error(`Error execute governance ${errorExecute.message}`);
      resetExecute();
    }
  }, [errorConfirm, errorExecute]);

  const getGovernanceConfirmed = async () => {
    const result = await getCurrentGovernanceChangeConfirmations(
      network,
      removeVisibleModifier(data.data.request_id)
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

  const handleConfirmGovernance = async () => {
    if (!selectedWallet) return;
    const txIdHash = await applyConfirmChangeGovernanceTicket(data);
    if (txIdHash) {
      const signed = JSON.parse(
        localStorage.getItem("signedGovernances") || "[]"
      );
      if (!signed.includes(data.id)) {
        signed.push(data.id);
        localStorage.setItem("signedGovernances", JSON.stringify(signed));
      }
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
      // @TODO: when executed change goverance, the current WalletRecord will be outdated. We should remove selected wallet from local and refetch by getWalletCreated() and update it.
      // @TODO (need sdk update): and for owners that also have the same wallet, we should add a logic to check if the wallet is still valid or not when user open the app.
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
      {/* @TODO (need backend) add date */}
      <TableCell>{data.data.sequence}</TableCell>
      <TableCell>
        <Button
          variant={"outline"}
          onClick={
            type === "execute"
              ? handleExcuteGovernence
              : handleConfirmGovernance
          }
          disabled={isProcessingConfirm || isProcessingExecute}
        >
          {isProcessingConfirm || isProcessingExecute ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <>{type === "execute" ? "Execute" : "Agree"}</>
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
