import { TableCell, TableRow } from "@/components/ui/table";
import { TokenRecord } from "zerosecurehq-sdk/dist/useGetTokenRecord";

interface TokenRawProps {
  token: TokenRecord;
}

const TokenRaw = ({ token }: TokenRawProps) => {
  return (
    <TableRow>
      <TableCell>{token.name}</TableCell>
      <TableCell>{token.data.amount}</TableCell>
      <TableCell>{token.data.token_id}</TableCell>
      <TableCell>{token.data.authorized_until}</TableCell>
    </TableRow>
  );
};

export default TokenRaw;
