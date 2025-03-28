import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Link,
  Save,
  MoreHorizontal,
  Wallet,
  Pin,
  Bookmark,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import NewAccountButton from "@/components/dashboard/new-account/NewAccountButton";
import { Badge } from "@/components/ui/badge";

const accounts = [
  { id: 1, address: "0x111...111", balance: "$0.0" },
  { id: 2, address: "0x222...222", balance: "$5" },
  { id: 3, address: "0x333...333", balance: "$6" },
  { id: 1, address: "0x444...444", balance: "$4" },
];

const Connect = () => {
  const [selected, setSelected] = useState("");
  const item = accounts.find((account) => account.address === selected);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header isConnected={false} />
      <div className="mt-16">
        <div className="max-w-3xl mx-auto py-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My accounts</h1>
            <div className="flex gap-4">
              <NewAccountButton />
            </div>
          </div>

          {/* Search + Sort */}
          <div className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <Input
                placeholder="Search your wallet name"
                className="w-full md:w-2/3"
              />
              <div className="text-gray-500 text-sm self-center">
                Sort by: Most recent
              </div>
            </div>

            {/* Pinned */}
            <div>
              <h2 className="mb-2 flex items-center ">
                <Bookmark className="mr-1" size={18} />
                <span className="text font-medium">Pinned</span>
              </h2>
              <div className="border border-dashed border-gray-300 p-6 text-gray-500 text-center rounded-lg flex items-center justify-center">
                Personalize your account list by clicking the{" "}
                <Pin className="mx-1" size={18} /> icon on the accounts most
                important to you.
              </div>
            </div>
            <div className="flex items-center gap-2 cursor-pointer">
              <span className="font-medium">Accounts</span>
            </div>
            {!selected && (
              <div>
                <div className="flex gap-3">
                  <Select onValueChange={(value) => setSelected(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a wallet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select wallet</SelectLabel>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.address}>
                            {account.address}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-center py-6 space-y-4">
                  <p>
                    Connect a wallet to view your Safe Accounts or to create a
                    new one
                  </p>
                  <Button className="flex items-center gap-2 mx-auto">
                    <Wallet size={16} /> Connect a wallet
                  </Button>
                </div>
              </div>
            )}

            {selected && item && (
              <RouterLink
                to={`/`}
                className="flex items-center gap-2 p-4 border border-gray-300 rounded-md justify-between"
              >
                <div className="flex items-center gap-2 flex-1">
                  <div className="h-12 w-12 rounded-xl bg-gradient-primary" />
                  <div className="flex flex-col justify-center">
                    <span className="font-semibold ">aleosasd...sa2s</span>
                    <span className="text-gray-600 text-sm">$20.21 Aleo</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-end flex-1">
                  <div className="flex items-center gap-4">
                    <div className="">
                      <Badge>1</Badge> / 1
                    </div>
                    <Pin className="text-gray-400" size={20} />
                    <MoreHorizontal className="text-gray-400" />
                  </div>
                </div>
              </RouterLink>
            )}
          </div>

          {/* Import Safe */}
          <div className="mt-6 flex flex-col items-center gap-4">
            <p className="text-gray-600 text-sm font-bold">
              Powered by ZeroSecure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connect;
