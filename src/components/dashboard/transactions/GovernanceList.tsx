import {
  Table,
  TableBody,
  TableCaption,
} from "@/components/ui/table";
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
  const [governanceComfirm, setGovernanComfirm] = useState<
    ConfirmChangeGovernanceTicketRecord[]
  >([]);
  const [governanceExecute, setGovernanExecute] = useState<
    ExecuteChangeGovernanceTicketRecord[]
  >([]);

  const getGovernanceConfirm = async () => {
    const result = await getConfirmGovernanceTicket();
    setGovernanComfirm(result ?? []);
  };

  const getGovernanceExecute = async () => {
    const result = await getExecuteGovernanceTicket();
    setGovernanExecute(result ?? []);
  };

  useEffect(() => {
    if (publicKey) {
      getGovernanceConfirm();
      getGovernanceExecute();
    }
  }, [publicKey]);

  useEffect(() => {
    if (errorConfirm) {
      toast("Something went wrong");
      resetConfirm();
    }
    if (errorExecute) {
      toast("Something went wrong");
      resetExecute();
    }
  }, [errorConfirm, errorExecute]);

  return (
    <article>
      <Table>
        <TableCaption className="caption-top text-sm">
          Your governance transactions will be listed here.
          {(isProcessingConfirm || isProcessingExcute) && (
            <p className="mt-3 text-center">
              Please wait while we are fetching your signing transactions ...
            </p>
          )}
          {!isProcessingConfirm &&
            !isProcessingExcute &&
            governanceComfirm.length &&
            governanceExecute.length === 0 && (
              <p className="mt-3 text-center">
                You have no governance transactions.
              </p>
            )}
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
