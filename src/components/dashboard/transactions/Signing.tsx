import { Table, TableBody, TableCaption } from "@/components/ui/table";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { useEffect, useState } from "react";
import {
  ConfirmTransferTicketRecord,
  useGetConfirmTransferTicket,
} from "zerosecurehq-sdk";
import SigningRaw from "./SigningRaw";

// const fakeTransferTickets: ConfirmTransferTicketRecord[] = [
//   {
//     id: "rec_001",
//     spent: false,
//     recordName: "confirm_transfer_ticket",
//     name: "ticket_001",
//     owner: "aleo1exampleowneraddress1",
//     program_id: "transfer_program_v1",
//     status: "confirmed",
//     data: {
//       wallet_address: "aleo1walletaddress001",
//       amount: "100",
//       transfer_id: "transfer_abc_001",
//       to: "aleo1recipient001"
//     }
//   },
//   {
//     id: "rec_002",
//     spent: true,
//     recordName: "confirm_transfer_ticket",
//     name: "ticket_002",
//     owner: "aleo1exampleowneraddress2",
//     program_id: "transfer_program_v1",
//     status: "spent",
//     data: {
//       wallet_address: "aleo1walletaddress002",
//       amount: "250",
//       transfer_id: "transfer_abc_002",
//       to: "aleo1recipient002"
//     }
//   },
//   {
//     id: "rec_003",
//     spent: false,
//     recordName: "confirm_transfer_ticket",
//     name: "ticket_003",
//     owner: "aleo1exampleowneraddress3",
//     program_id: "transfer_program_v1",
//     status: "pending",
//     data: {
//       wallet_address: "aleo1walletaddress003",
//       amount: "50",
//       transfer_id: "transfer_abc_003",
//       to: "aleo1recipient003"
//     }
//   }
// ];

const Signing = () => {
  const { publicKey } = useWallet();
  const { getConfirmTransferTicket, error, isProcessing, reset } =
    useGetConfirmTransferTicket();

  const [signing, setSigning] = useState<ConfirmTransferTicketRecord[]>([]);

  const getSigning = async () => {
    setSigning(await getConfirmTransferTicket());
  };

  useEffect(() => {
    if (publicKey) {
      getSigning();
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
          {signing.length > 0 &&
            signing.map((item, index) => (
              <SigningRaw key={index} data={item} getSigning={getSigning} />
            ))}
        </TableBody>
      </Table>
    </article>
  );
};

export default Signing;
