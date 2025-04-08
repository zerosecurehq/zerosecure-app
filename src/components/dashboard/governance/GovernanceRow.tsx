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
  name?: string;
  owner: string;
  handleDelete: (publicKey: string) => void;
}

const GovernanceRow = ({ owner, handleDelete, name }: GovernanceRowProps) => {
  const { selectedWallet, publicKey } = useAccount();

  const signerNameList = JSON.parse(
    localStorage.getItem("mappingName") || "{}"
  );

  const walletAddress = selectedWallet?.data.wallet_address || "";
  const ownerName =
    signerNameList?.[removeVisibleModifier(walletAddress)]?.[owner] ?? "";

  return (
    <TableRow
      className={`${owner === publicKey && "pointer-events-none bg-gray-100"}`}
    >
      <TableCell className="text-center">
        {name?.trim() ? name : ownerName}
      </TableCell>
      <TableCell className="line-clamp-1 truncate">{removeVisibleModifier(owner)}</TableCell>
      <TableCell>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="group hover:border-red-400">
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
                onClick={() => handleDelete(owner)}
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
