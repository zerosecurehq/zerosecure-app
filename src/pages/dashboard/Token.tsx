import { Table, TableBody } from "@/components/ui/table";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTokenMetadata } from "zerosecurehq-sdk";
import { network } from "@/utils";
import { toast } from "sonner";
import useToken from "@/stores/useToken";
import TokenRow from "@/components/dashboard/token/TokenRow";

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
      toast.error("Token already exists");
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
      <div className="py-4"></div>

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
          </form>

          <Table className="mt-2">
            <TableBody>
              {tokens.length > 0 &&
                tokens.map((item, index) => (
                  <TokenRow
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
