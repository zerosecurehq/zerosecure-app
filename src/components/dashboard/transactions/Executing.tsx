import { Badge } from "@/components/ui/badge";
import { Button } from "../../ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { ExecuteTicketRecord, useGetExecuteTicket } from "zerosecurehq-sdk";
import { useEffect, useState } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";

const transactions = [
  {
    to: "aleo12a...ss2s",
    amount: "12.12 Aleo",
    time: "Mar 16, 2025 13:42:56",
    signers: 3,
    signed: 2,
  },
  {
    to: "aleo12a...ss2s",
    amount: "12.12 Aleo",
    time: "Mar 16, 2025 13:42:56",
    signers: 3,
    signed: 2,
  },
  {
    to: "aleo12a...ss2s",
    amount: "12.12 Aleo",
    time: "Mar 16, 2025 13:42:56",
    signers: 3,
    signed: 3,
  },
  // {
  //   action: "Smart Contract Deployed",
  //   createdBy: "0x2F8D...C3E4",
  //   time: "11:20 AM",
  //   status: "Success",
  // },
  // {
  //   action: "Liquidity Added",
  //   createdBy: "0x55AA...FF99",
  //   time: "1:45 PM",
  //   status: "Pending",
  // },
  // {
  //   action: "Vote Submitted",
  //   createdBy: "0x7B3E...11DD",
  //   time: "3:30 PM",
  //   status: "Failed",
  // },
];

const Signing = () => {
  const { publicKey } = useWallet();
  const { getExecuteTicket, error, isProcessing, reset } =
    useGetExecuteTicket();
  const [excute, setExcute] = useState<ExecuteTicketRecord[]>([]);

  const handleGetExcute = async () => {
    const result = await getExecuteTicket();
    if (result !== undefined) {
      setExcute(result);
    }
  };

  useEffect(() => {
    if (publicKey) {
      handleGetExcute();
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
          {excute.map((item, index) => (
            <TableRow key={index} className="text-center relative">
              <TableCell className="font-medium">{item.data.to}</TableCell>
              <TableCell>{item.data.amount}</TableCell>
              {/* @TODO check field time */}
              <TableCell>{item.data.transfer_id}</TableCell>
              <TableCell>
                <Button variant={"outline"}>Sign Transaction</Button>
              </TableCell>
              {/* {transaction.signed !== transaction.signers ? (
                <Badge
                  variant={"outline"}
                  className="absolute top-1/2 -translate-y-1/2 right-0 rounded-full"
                >
                  {transaction.signed}/{transaction.signers}
                </Badge>
              ) : (
                <Badge
                  variant={"outline"}
                  className="absolute top-1/2 -translate-y-1/2 right-0 rounded-full bg-gradient-primary text-white"
                >
                  {transaction.signed}/{transaction.signers}
                </Badge>
              )} */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </article>
  );
};

export default Signing;
