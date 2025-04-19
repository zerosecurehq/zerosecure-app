import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import useAccount from "@/stores/useAccount";
import { Trash2Icon } from "lucide-react";
import { removeVisibleModifier } from "zerosecurehq-sdk";

interface GovernanceRowProps {
  data: {
    name: string;
    address: string;
  };
  isProcessing: boolean;
  handleDelete: (publicKey: string) => void;
}

const GovernanceRow = ({
  data,
  handleDelete,
  isProcessing,
}: GovernanceRowProps) => {
  const { publicKey } = useAccount();
  let isSelf = removeVisibleModifier(data.address) === publicKey;
  console.log("isSelf", isSelf);
  return (
    <TableRow className={`${isSelf && "pointer-events-none bg-gray-100"}`}>
      <TableCell className="text-center">
        {data.name?.trim() ? data.name : "No name"}
      </TableCell>
      <TableCell className="text-left">
        {removeVisibleModifier(data.address)}
      </TableCell>
      <TableCell>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className={`group hover:border-red-400 ${
                isSelf ? "opacity-0" : ""
              }`}
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
                Deleting this signer is irreversible and will remove all related
                data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:text-gray-300 hover:bg-red-500"
                onClick={() => handleDelete(data.address)}
                disabled={isProcessing}
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

export default GovernanceRow;
