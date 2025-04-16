import { Table, TableBody, TableCaption } from "@/components/ui/table";
import React, { useState } from "react";
import { TokenRecord } from "zerosecurehq-sdk/dist/useGetTokenRecord";
import TokenRaw from "./TokenRaw";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Warning from "@/components/ui/Warning";
import { getTokenMetadata } from "zerosecurehq-sdk";
import { network } from "@/utils";
import { toast } from "sonner";
import useToken from "@/stores/useToken";

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
  const [tokenId, setTokenId] = useState("");
  const { tokens, addTokens, removeToken } = useToken();

  const handleDelete = (id: string) => {
    removeToken(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenId) return;
    if (tokens.some((item) => item.token_id === tokenId)) {
      toast("Token already exists");
      setTokenId("");
      return;
    }
    const infoToken = await getTokenMetadata(network, tokenId);
    if (infoToken) {
      addTokens([infoToken]);
      setTokenId("");
    }
  };

  return (
    <section className="w-full overflow-auto px-28">
      <div className="py-4">
        <Warning
          msg={
            "Do not directly send aleo credits to multisig address because it is virtual and not exit in the blockchain."
          }
        />
      </div>

      <Card>
        <CardContent className="pt-6">
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
            <Button
              variant={"outline"}
              type="submit"
              disabled={!tokenId.trim()}
            >
              Add
            </Button>
            {/* <Button variant={"outline"} type="submit" disabled={!tokenId.trim()}>
              See balance
            </Button> */}
          </form>

          <Table className="mt-2">
            <TableBody>
              {tokens.length > 0 &&
                tokens.map((item, index) => (
                  <TokenRaw
                    key={index}
                    token={item}
                    handleDelete={handleDelete}
                  />
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
};

export default Token;
