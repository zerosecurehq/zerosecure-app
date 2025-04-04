import {
  Table,
  TableBody,
  TableCaption,
} from "@/components/ui/table";
import {
  ExecuteTicketRecord,
  useGetExecuteTicket,
} from "zerosecurehq-sdk";
import { useEffect, useState } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import ExcutingRaw from "./ExcutingRaw";

// const fakeExecuteTickets: ExecuteTicketRecord[] = [
//   {
//     id: "exec_001",
//     spent: false,
//     recordName: "execute_ticket",
//     name: "ticket_exec_001",
//     owner: "aleo1ownerexec001",
//     program_id: "execute_program_v1",
//     status: "ready",
//     data: {
//       wallet_address: "aleo1walletexec001",
//       amount: "500",
//       transfer_id: "transfer_exec_001",
//       to: "aleo1recipientexec001"
//     }
//   },
//   {
//     id: "exec_002",
//     spent: true,
//     recordName: "execute_ticket",
//     name: "ticket_exec_002",
//     owner: "aleo1ownerexec002",
//     program_id: "execute_program_v1",
//     status: "executed",
//     data: {
//       wallet_address: "aleo1walletexec002",
//       amount: "200",
//       transfer_id: "transfer_exec_002",
//       to: "aleo1recipientexec002"
//     }
//   },
//   {
//     id: "exec_003",
//     spent: false,
//     recordName: "execute_ticket",
//     name: "ticket_exec_003",
//     owner: "aleo1ownerexec003",
//     program_id: "execute_program_v1",
//     status: "pending",
//     data: {
//       wallet_address: "aleo1walletexec003",
//       amount: "300",
//       transfer_id: "transfer_exec_003",
//       to: "aleo1recipientexec003"
//     }
//   }
// ];


const Signing = () => {
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
    if (publicKey) {
      getExcute();
    }
  }, [publicKey]);

  return (
    <article>
      <Table>
        <TableCaption className="caption-top text-sm">
          A list of your wait for signing transactions.
        </TableCaption>
        <TableBody>
          {excute.length === 0 && (
            <p className="text-center mt-3">No signing transaction</p>
          )}
          {excute.length > 0 && excute.map((item, index) => (
            <ExcutingRaw key={index} data={item} getExcute={getExcute} />
          ))}
        </TableBody>
      </Table>
    </article>
  );
};

export default Signing;
