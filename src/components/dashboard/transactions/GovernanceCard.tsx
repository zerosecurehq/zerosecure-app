import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import useAccount from "@/stores/useAccount";
import {
  formatAleoAddress,
  getAddedOwners,
  getRemovedOwners,
  network,
} from "@/utils";
import {
  Copy,
  Loader2Icon,
  Settings2,
  UserCog,
  UserRoundMinus,
  UserRoundPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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

  const addedOwners = getAddedOwners(cleanedNew, cleanedOld);
  const addCount = addedOwners.length;
  const removedOwners = getRemovedOwners(cleanedNew, cleanedOld);
  const removeCount = removedOwners.length;

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

  const handleCopy = (addr: string) => {
    navigator.clipboard.writeText(addr).then(() => {
      toast.success("Copied to clipboard");
    });
  };

  let isEnoughConfirm = confirmed >= parseInt(data.data.new_threshold);
  let isThresholdChange =
    parseInt(data.data.new_threshold) !== parseInt(data.data.old_threshold);

  return (
    <TableRow className="text-center relative cursor-pointer">
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <div className="flex items-center justify-center gap-2 hover:underline">
              <UserCog size={16} />{" "}
              {`Added (+${addCount}) | Removed (-${removeCount})`}
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <div>
              <span className="font-semibold">Added</span>
              <div>
                {addedOwners.map((addr) => (
                  <div className="flex items-center gap-2">
                    <UserRoundPlus size={16} />
                    {formatAleoAddress(addr)}
                    <Copy
                      onClick={() => handleCopy(addr)}
                      className="cursor-pointer"
                      size={16}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="font-semibold">Removed</span>
              <div>
                {removedOwners.map((addr) => (
                  <div className="flex items-center gap-2">
                    <UserRoundMinus size={16} />
                    {formatAleoAddress(addr)}
                    <Copy
                      onClick={() => handleCopy(addr)}
                      className="cursor-pointer"
                      size={16}
                    />
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-center gap-2">
          <Settings2 size={16} />
          {!isThresholdChange
            ? `${parseInt(data.data.new_threshold)} (no change)`
            : `${parseInt(data.data.old_threshold)} -> ${parseInt(
                data.data.new_threshold
              )}`}
        </div>
      </TableCell>
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
        className={`absolute top-1/2 right-0 -translate-y-1/2 rounded-full mr-2 ${
          isEnoughConfirm ? "bg-gradient-primary text-white" : ""
        }`}
        variant={"outline"}
      >
        {confirmed}/{parseInt(data.data.old_threshold)}
      </Badge>
    </TableRow>
  );
};

export default GovernanceCard;
