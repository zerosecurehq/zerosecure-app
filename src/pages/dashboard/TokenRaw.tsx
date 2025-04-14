import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Trash2Icon } from "lucide-react";
import { TokenMetadata } from "zerosecurehq-sdk";

interface TokenRawProps {
  token: TokenMetadata;
  handleDelete: (publicKey: string) => void;
}

const TokenRaw = ({ token, handleDelete }: TokenRawProps) => {
  return (
    <TableRow className="text-center">
      <TableCell>{token.name || `No name`}</TableCell>
      <TableCell>{token.token_id}</TableCell>
      <TableCell>{token.symbol}</TableCell>
      <TableCell>
      <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className={`group hover:border-red-400`}
            >
              <Trash2Icon className="group-hover:text-red-400" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to proceed?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Deleting this token is irreversible and will remove all related
                data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:text-gray-300 hover:bg-red-500"
                onClick={() => handleDelete(token.token_id)}
              >
                <Trash2Icon />
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
};

export default TokenRaw;
