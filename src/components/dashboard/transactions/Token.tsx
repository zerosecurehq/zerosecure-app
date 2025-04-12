import {
  Table,
  TableBody,
  TableCaption,
} from "@/components/ui/table";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import React, { useEffect, useState } from "react";
import {
  TokenRecord,
  useGetTokenRecord,
} from "zerosecurehq-sdk/dist/useGetTokenRecord";
import TokenRaw from "./TokenRaw";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAccount from "@/stores/useAccount";
import { toast } from "sonner";
import RawSkeleton from "./RawSkeleton";

export const fakeTokens: TokenRecord[] = [
  {
    id: "rec1",
    spent: false,
    recordName: "record_one",
    name: "Token A",
    owner: "aleo1abcd1234567890",
    program_id: "program_001",
    data: {
      amount: "1000",
      token_id: "token_001",
      external_authorization_required: "false",
      authorized_until: "2025-12-31T23:59:59Z",
    },
  },
  {
    id: "rec2",
    spent: false,
    recordName: "record_two",
    name: "Token B",
    owner: "aleo1efgh1234567890",
    program_id: "program_002",
    data: {
      amount: "2500",
      token_id: "token_002",
      external_authorization_required: "true",
      authorized_until: "2026-06-30T23:59:59Z",
    },
  },
  {
    id: "rec3",
    spent: true,
    recordName: "record_three",
    name: "Token C",
    owner: "aleo1ijkl1234567890",
    program_id: "program_003",
    status: "expired",
    data: {
      amount: "500",
      token_id: "token_003",
      external_authorization_required: "false",
      authorized_until: "2024-12-01T00:00:00Z",
    },
  },
];

const Token = () => {
  const { publicKey } = useWallet();
  const { getTokenRecord, error, isProcessing, reset } = useGetTokenRecord();
  const [tokenId, setTokenId] = useState("");
  const { tokens, setToken } = useAccount();

  useEffect(() => {
    if (publicKey) {
      const oldToken = JSON.parse(localStorage.getItem("accounts") || "{}");
      if (Array.isArray(oldToken[publicKey]?.tokens)) {
        setToken(oldToken[publicKey].tokens);
      }
    }
  }, [publicKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tokenRecord = await getTokenRecord(tokenId);
    if (Array.isArray(tokenRecord)) {
      setToken(tokenRecord);
      setTokenId("");
      toast("Token transactions fetched successfully");
      reset();
    }
  };

  useEffect(() => {
    if (error) {
      toast("Failed to fetch token transactions");
      reset();
    }
  }, [error]);

  return (
    <article className="p-4">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 justify-end"
      >
        <Input
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          placeholder="Enter token id"
          className="w-1/4"
        />
        <Button variant={"outline"} type="submit">
          Enter
        </Button>
      </form>

      <Table>
        <TableCaption className="caption-top text-sm">
          Your token transactions will be listed here.
          {isProcessing && (
            <p className="text-center mt-3">
              Please wait while we are fetching your signing transactions ...
            </p>
          )}
          {!isProcessing && tokens.length === 0 && (
            <p className="text-center mt-3">No token transactions</p>
          )}
        </TableCaption>
        <TableBody>
          {isProcessing && <RawSkeleton />}
          {fakeTokens.length > 0 &&
            fakeTokens.map((item, index) => (
              <TokenRaw key={index} token={item} />
            ))}
        </TableBody>
      </Table>
    </article>
  );
};

export default Token;
