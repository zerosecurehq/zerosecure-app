import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { useEffect, useState } from "react";
import {
  ConfirmTransferTicketRecord,
  useApplyConfirmTransferTicket,
  useGetConfirmTransferTicket,
} from "zerosecurehq-sdk";

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

const Signing = () => {
  const { publicKey } = useWallet();
  const { getConfirmTransferTicket, error, isProcessing, reset } =
    useGetConfirmTransferTicket();
  const {
    applyConfirmTransferTicket,
    error: errorConfirm,
    isProcessing: isProcessingConfirm,
    reset: resetConfirm,
    txId: txIdConfirm,
  } = useApplyConfirmTransferTicket();
  const [signing, setSigning] = useState<ConfirmTransferTicketRecord[]>([]);

  const handleGetSigning = async () => {
    setSigning(await getConfirmTransferTicket());
  };

  const handleApplyConfirm = async (
    dataConfirm: ConfirmTransferTicketRecord
  ) => {
    await applyConfirmTransferTicket(dataConfirm);
  };

  useEffect(() => {
    if (publicKey) {
      handleGetSigning();
    }
  }, [publicKey]);

  return (
    <article>
      <Table>
        <TableCaption className="caption-top text-sm">
          A list of your wait for signing transactions.
        </TableCaption>
        <TableBody>
          {signing.length === 0 && (
            <p className="text-center mt-3">No signing transaction</p>
          )}
          {signing.map((item, index) => (
            <TableRow
              key={index}
              className="text-center relative"
              onClick={() => handleApplyConfirm(item)}
            >
              <TableCell className="font-medium">
                {item?.data.to}
              </TableCell>
              <TableCell>{item?.data.amount}</TableCell>
              {/* @TODO check field time */}
              <TableCell>{item?.data.transfer_id}</TableCell>
              <TableCell>
                <Button variant={"outline"}>Sign Transaction</Button>
              </TableCell>
              <Badge
                variant={"outline"}
                className="absolute top-1/2 right-0 -translate-y-1/2 rounded-full"
              >
                2/3
              </Badge>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </article>
  );
};

export default Signing;
