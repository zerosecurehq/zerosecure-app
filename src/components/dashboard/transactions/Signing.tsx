import { Table, TableBody, TableCaption } from "@/components/ui/table";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { useEffect, useState } from "react";
import {
  ConfirmTransferTicketRecord,
  useGetConfirmTransferTicket,
} from "zerosecurehq-sdk";
import SigningRaw from "./SigningRaw";
import { toast } from "sonner";
import RawSkeleton from "./RawSkeleton";

const Signing = () => {
  const { publicKey } = useWallet();
  const { getConfirmTransferTicket, error, isProcessing, reset } =
    useGetConfirmTransferTicket();
  const [signing, setSigning] = useState<ConfirmTransferTicketRecord[]>([]);

  const getSigning = async () => {
    // @TODO sometimes wallet takes time to update ConfirmTicket to ExecuteTicket, shouldnt render signing transaction that is signed
    // how: when user successfully signed transaction, we should mark it as signed in the local storage
    const confirmTickets = await getConfirmTransferTicket();
    if (confirmTickets !== void 0) {
      setSigning(confirmTickets);
    }
  };

  useEffect(() => {
    if (publicKey) {
      getSigning();
    }
  }, [publicKey]);

  useEffect(() => {
    if (error) {
      toast("Something went wrong");
      reset();
    }
  }, [error]);

  return (
    <article>
      <Table>
        <TableCaption className="caption-top text-sm">
          Your signing transactions will be listed here.
        </TableCaption>
        <TableBody>
          {isProcessing && <RawSkeleton />}
          {signing.length > 0 &&
            signing.map((item, index) => (
              <SigningRaw setSigning={setSigning} key={index} data={item} getSigning={getSigning} />
            ))}
        </TableBody>
      </Table>
    </article>
  );
};

export default Signing;
