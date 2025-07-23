import { Table, TableBody, TableCaption } from "@/components/ui/table";
import { ExecuteTicketRecord, useGetExecuteTicket } from "zerosecurehq-sdk";
import { useEffect, useState } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import ExecutingRow from "./ExecutingRow";
import { toast } from "sonner";
import RawSkeleton from "./RawSkeleton";

const Executing = () => {
  const { publicKey } = useWallet();
  const { getExecuteTicket, error, isProcessing, reset } =
    useGetExecuteTicket();
  const [excute, setExcute] = useState<ExecuteTicketRecord[]>([]);

  const getExcute = async () => {
    const result = await getExecuteTicket();
    if (result !== undefined) {
      setExcute(result);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error("Something went wrong while fetching execute tickets");
      reset();
    }
  }, [error]);

  useEffect(() => {
    if (publicKey) {
      getExcute();
    }
  }, [publicKey]);

  return (
    <article>
      <Table>
        <TableCaption className="caption-top text-sm">
          If you have any execute tickets, you can apply them here. Open the
          wallet to make it able to scan the execute tickets.
        </TableCaption>
        <TableBody>
          {isProcessing && <RawSkeleton />}
          {excute.length > 0 &&
            excute.map((item, index) => (
              <ExecutingRow key={index} data={item} getExcute={getExcute} />
            ))}
        </TableBody>
      </Table>
    </article>
  );
};

export default Executing;
