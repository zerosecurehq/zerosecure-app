import { TableCell, TableRow } from "@/components/ui/table";
import { TokenMetadata } from "zerosecurehq-sdk";

interface TokenRawProps {
  token: TokenMetadata;
}

const TokenRaw = ({ token }: TokenRawProps) => {
  return (
    <TableRow className="text-center">
      <TableCell>{token.name}</TableCell>
      <TableCell>{token.token_id}</TableCell>
      <TableCell>{token.symbol}</TableCell>
    </TableRow>
  );
};

export default TokenRaw;
