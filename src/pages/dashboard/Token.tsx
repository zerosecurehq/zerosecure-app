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
    try {
      // Allow both field and non-field token IDs
      let shawdowedTokenId = tokenId.includes("field")
        ? tokenId
        : `${tokenId}field`;
      // Validate the token ID format
      if (!shawdowedTokenId.match(/^\d+field$/)) {
        return toast.error(
          "Invalid token ID format. It should be a number followed by 'field'."
        );
      }
      const infoToken = await getTokenMetadata(network, shawdowedTokenId);

      if (infoToken) {
        addTokens([infoToken]);
        setTokenId("");
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Mapping not found")
      ) {
        toast.error("Token cannot be found, please check the token id.");
      }
    }
  };

  return (
    <section className="w-full overflow-auto px-28">
      <div className="py-4"></div>
      <Card>
        <CardContent className="pt-6">
          <div className="flex w-100">
            <div>
              <span className="font-semibold">Your Tokens</span>
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 justify-end flex-1"
            >
              <Input
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                placeholder="Enter token id (eg. 1234field)"
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
          </div>
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
