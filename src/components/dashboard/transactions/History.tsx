import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";

const transactions = [
  {
    to: "aleo12a...ss2s",
    amount: "12.12 Aleo",
    time: "Mar 16, 2025 13:42:56",
    signers: "3",
    signed: "2",
  },
  {
    to: "aleo12a...ss2s",
    amount: "12.12 Aleo",
    time: "Mar 16, 2025 13:42:56",
    signers: "3",
    signed: "2",
  },
  {
    to: "aleo12a...ss2s",
    amount: "12.12 Aleo",
    time: "Mar 16, 2025 13:42:56",
    signers: "3",
    signed: "2",
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

const History = () => {
  return (
    <article>
      <Table>
        <TableCaption className="caption-top text-sm">
          A list of your history transactions.
        </TableCaption>
        <TableBody>
          {transactions.map((transaction, index) => (
            <TableRow key={index} className="text-center relative">
              <TableCell className="font-medium">{transaction.to}</TableCell>
              <TableCell>{transaction.amount}</TableCell>
              <TableCell>{transaction.time}</TableCell>
              <TableCell>
                <span className="font-semibold text-sm">Finalized</span>
              </TableCell>
              <TableCell>
                <Button variant={"outline"} className="">Sign Transaction</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </article>
  );
};

export default History;
