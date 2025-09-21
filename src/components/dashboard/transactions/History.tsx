import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { WalletRecord, useGetTransferHistory } from "zerosecurehq-sdk";
import useAccount from "@/stores/useAccount";
import RawSkeleton from "./RawSkeleton";

const History = () => {
  const { selectedWallet } = useAccount();
  const { history, isLoading, error, fetchTransferHistory } =
    useGetTransferHistory({
      walletRecord: selectedWallet as WalletRecord,
    });

  useEffect(() => {
    fetchTransferHistory();
  }, [fetchTransferHistory]);

  if (isLoading) {
    return <RawSkeleton />;
  }

  if (error) {
    return (
      <p className="text-center text-sm text-red-500">Error: {error.message}</p>
    );
  }

  return (
    <article>
      <Table>
        <TableBody>
          {history.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-sm text-muted">
                No transactions yet
              </TableCell>
            </TableRow>
          ) : (
            history.map((tx, index) => (
              <TableRow key={tx.transferId || index} className="text-center">
                <TableCell className="font-medium">{tx.to}</TableCell>
                <TableCell>{tx.amount} Aleo</TableCell>
                <TableCell>{new Date(tx.timestamp).toLocaleString()}</TableCell>
                <TableCell>
                  <span className="font-semibold text-sm capitalize">
                    {tx.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="outline">Sign Transaction</Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </article>
  );
};

export default History;
