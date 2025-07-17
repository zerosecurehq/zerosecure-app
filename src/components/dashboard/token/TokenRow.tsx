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
import { WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import { Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getMultisigWalletBalance,
  removeVisibleModifier,
  TokenMetadata,
} from "zerosecurehq-sdk";

interface TokenRowProps {
  token: TokenMetadata;
  handleDelete: (publicKey: string) => void;
}

const TokenRow = ({ token, handleDelete }: TokenRowProps) => {
  let [tokenBalance, setTokenBalance] = useState(0);
  let { selectedWallet } = useAccount();

  useEffect(() => {
    if (selectedWallet) {
      const getTokenBalance = async () => {
        try {
          const balance = await getMultisigWalletBalance(
            WalletAdapterNetwork.TestnetBeta,
            removeVisibleModifier(selectedWallet.data.wallet_address),
            token.token_id
          );
          setTokenBalance(balance);
        } catch (error) {
          console.error("Error fetching token balance:", error);
          setTokenBalance(0);
        }
      };
      getTokenBalance();
    }
  }, [selectedWallet]);

  return (
    <TableRow className="text-center">
      <TableCell className="text-gray-500 font-semibold">
        #{token.token_id}
      </TableCell>
      <TableCell>
        {token.name || `No name`}
        <span className="ml-2 inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset">
          {token.symbol}
        </span>
      </TableCell>
      <TableCell>
        {tokenBalance} {token.symbol}
      </TableCell>
      <TableCell>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className={`group hover:border-red-400`}>
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

export default TokenRow;
