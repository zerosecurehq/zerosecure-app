import { Table, TableBody, TableCaption } from "@/components/ui/table";
import GovernanceCard from "./GovernanceCard";
import {
  ConfirmChangeGovernanceTicketRecord,
  ExecuteChangeGovernanceTicketRecord,
  removeVisibleModifier,
  useGetConfirmChangeGovernanceTicket,
  useGetExecuteChangeGovernanceTicket,
} from "zerosecurehq-sdk";
import { ZERO_ADDRESS } from "@/pages/connect/CardWallet";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import RawSkeleton from "./RawSkeleton";

const GovernanceList = () => {
  const { publicKey } = useWallet();
  const {
    getConfirmGovernanceTicket,
    isProcessing: isProcessingConfirm,
    error: errorConfirm,
    reset: resetConfirm,
  } = useGetConfirmChangeGovernanceTicket();
  const {
    getExecuteGovernanceTicket,
    isProcessing: isProcessingExcute,
    error: errorExecute,
    reset: resetExecute,
  } = useGetExecuteChangeGovernanceTicket();
  const [governanceComfirm, setGovernanceComfirm] = useState<
    ConfirmChangeGovernanceTicketRecord[]
  >([]);
  const [governanceExecute, setGovernanceExecute] = useState<
    ExecuteChangeGovernanceTicketRecord[]
  >([]);

  const getGovernanceConfirm = async () => {
    const result = await getConfirmGovernanceTicket();
    if (result === void 0) return;
    const signed = JSON.parse(
      localStorage.getItem("signedGovernances") || "[]"
    );
    const filtered = result.filter((item) => !signed.includes(item.id));
    setGovernanceComfirm(filtered);
  };

  const getGovernanceExecute = async () => {
    const result = await getExecuteGovernanceTicket();
    setGovernanceExecute(result ?? []);
  };

  useEffect(() => {
    if (publicKey) {
      getGovernanceConfirm();
      getGovernanceExecute();
    }
  }, [publicKey]);

  useEffect(() => {
    if (errorConfirm) {
      toast.error(
        "Something went wrong with confirm governance " + errorConfirm.message
      );
      resetConfirm();
    }
    if (errorExecute) {
      toast.error(
        "Something went wrong with execute governance " + errorExecute.message
      );
      resetExecute();
    }
  }, [errorConfirm, errorExecute]);

  return (
    <article>
      <Table>
        <TableCaption className="caption-top text-sm">
          Your governance change request will be listed here.
        </TableCaption>
        <TableBody>
          {(isProcessingConfirm || isProcessingExcute) && <RawSkeleton />}

          {governanceComfirm
            .map((record) => ({
              ...record,
              data: {
                ...record.data,
                new_owners: record.data.new_owners.filter(
                  (addr) => removeVisibleModifier(addr) !== ZERO_ADDRESS
                ),
              },
            }))
            .filter((record) => record.data.new_owners.length > 0)
            .map((item) => (
              <GovernanceCard
                key={item.id}
                type="confirm"
                data={item}
                getGovernanceConfirm={getGovernanceConfirm}
                getGovernanceExecute={getGovernanceExecute}
              />
            ))}
          {governanceExecute
            .map((record) => ({
              ...record,
              data: {
                ...record.data,
                new_owners: record.data.new_owners.filter(
                  (addr) => removeVisibleModifier(addr) !== ZERO_ADDRESS
                ),
              },
            }))
            .filter((record) => record.data.new_owners.length > 0)
            .map((item) => (
              <GovernanceCard
                key={item.id}
                type="execute"
                data={item}
                getGovernanceConfirm={getGovernanceConfirm}
                getGovernanceExecute={getGovernanceExecute}
              />
            ))}
        </TableBody>
      </Table>
    </article>
  );
};

export default GovernanceList;
