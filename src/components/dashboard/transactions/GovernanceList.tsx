import { Table, TableBody, TableCaption } from "@/components/ui/table";
import GovernanceCard from "./GovernanceCard";
import { removeVisibleModifier } from "zerosecurehq-sdk";
import { ZERO_ADDRESS } from "@/pages/connect/CardWallet";

const selected = {
  id: "a1b2c3d4-e5f6-7g8h-9i10-j11k12l13m14",
  spent: false,
  recordName: "Wallet",
  name: "Personal Wallet",
  owner: "aleo1ownerxyz1234567890abcdefghijklmnopqrstuv",
  program_id: "zerosecure_v2.aleo",
  data: {
    wallet_address: "aleo1xyzabc1234567890abcdefghijklmnopqrstuv.private",
    owners: [
      "aleo1qwevmvqurmuy4vgk07vhqevcjtnynnyexsp6a3ku5y6889q40yxs2af4s8.private",
      "aleo1userabc9876543210zxcvbnmlkjhgfdsaqwertyuiop.private",
      "aleo1signerxyz1357924680poiuytrewqlkjhgfdsamnbvcxz.private",
      "aleo1nodeabc8372619450vbnmasdfghjklpoiuytrewqzxcm.private",
      "aleo1agentxyz1928374650wertyuiopasdfghjklzxcvbnmq.private",
      "aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc.private",
      "aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc.private",
      "aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc.private",
    ],
    threshold: 1,
  },
  avatar: "bg-gradient-to-r from-blue-500 to-green-500",
};

const GovernanceList = () => {
  const isProcessing = true;

  return (
    <Table>
      <TableCaption className="caption-top text-sm">
        Your governance transactions will be listed here.
      </TableCaption>
      <TableBody>
        {isProcessing ? (
          <p className="text-center mt-3">
            Please wait while we are fetching your signing transactions ...
          </p>
        ) : (
          selected.data.owners.length === 0 && (
            <p className="text-center mt-3">No signing transactions</p>
          )
        )}
        {selected.data.owners.length > 0 &&
          selected.data.owners
            .filter((owner) => removeVisibleModifier(owner) !== ZERO_ADDRESS)
            .map((item, index) => <GovernanceCard key={index} data={item} />)}
      </TableBody>
    </Table>
  );
};

export default GovernanceList;
