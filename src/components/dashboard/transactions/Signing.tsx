import { Table, TableBody, TableCaption } from "@/components/ui/table";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { useEffect, useState } from "react";
import {
  ConfirmTransferTicketRecord,
  useGetConfirmTransferTicket,
} from "zerosecurehq-sdk";
import SigningRow from "./SigningRow";
import { toast } from "sonner";
import RawSkeleton from "./RawSkeleton";

const Signing = () => {
  const { publicKey } = useWallet();
  const { getConfirmTransferTicket, error, isProcessing, reset } =
    useGetConfirmTransferTicket();
  const [signing, setSigning] = useState<ConfirmTransferTicketRecord[]>([]);

  const getSigning = async () => {
    const confirmTickets = await getConfirmTransferTicket();
    if (confirmTickets !== void 0) {
      const signed = JSON.parse(
        localStorage.getItem("signedTransactions") || "[]"
      );
      const filtered = confirmTickets.filter(
        (item) => !signed.includes(item.id)
      );
      setSigning(filtered);
    }
  };

  useEffect(() => {
    if (publicKey) {
      getSigning();
    }
  }, [publicKey]);

  useEffect(() => {
    if (error) {
      toast.error("Something went wrong while fetching signing transactions.");
      reset();
    }
  }, [error]);

  return (
    <article>
      <Table>
        <TableCaption className="caption-top text-sm">
          If you have any signing tickets, you can apply them here. Open the
          wallet to make it able to scan the signing tickets.
        </TableCaption>
        <TableBody>
          {isProcessing && <RawSkeleton />}
          {signing.length > 0 &&
            signing.map((item, index) => (
              <SigningRow
                setSigning={setSigning}
                key={index}
                data={item}
                getSigning={getSigning}
              />
            ))}
        </TableBody>
      </Table>
    </article>
  );
};

export default Signing;
