import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { removeVisibleModifier } from "zerosecurehq-sdk";
import { ZERO_ADDRESS } from "../connect/CardWallet";
import GovernanceRow from "@/components/dashboard/governance/GovernanceRow";
import { UserPlus2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const selected = {
  id: "a1b2c3d4-e5f6-7g8h-9i10-j11k12l13m14",
  spent: false,
  recordName: "Wallet",
  name: "Personal Wallet",
  owner: "aleo1ownerxyz1234567890abcdefghijklmnopqrstuv",
  program_id: "zerosecure_v2.aleo",
  data: {
    wallet_address: "aleo1xyzabc1234567890abcdefghijklmnopqrstuv.private",
    owners: [
      "aleo1ownerxyz1234567890abcdefghijklmnopqrstuv.private",
      "aleo1userabc9876543210zxcvbnmlkjhgfdsaqwertyuiop.private",
      "aleo1signerxyz1357924680poiuytrewqlkjhgfdsamnbvcxz.private",
      "aleo1nodeabc8372619450vbnmasdfghjklpoiuytrewqzxcm.private",
      "aleo1agentxyz1928374650wertyuiopasdfghjklzxcvbnmq.private",
      "aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc.private",
      "aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc.private",
      "aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc.private",
    ],
    threshold: 1,
  },
  avatar: "bg-gradient-to-r from-blue-500 to-green-500",
};

const Governance = () => {
  const [addSignerList, setAddSignerList] = useState<
    Array<{ name: string; address: string }>
  >([]);
  const [newSigner, setNewSigner] = useState({ name: "", address: "" });
  const [openDialog, setOpenDialog] = useState(false);

  const handleDelete = (publicKey: string) => {
    const filteredOwner = selected.data.owners.filter(
      (item) => removeVisibleModifier(item) !== removeVisibleModifier(publicKey)
    );
    console.log("Deleted", filteredOwner);
  };

  return (
    <section className="bg-gray-100 w-full px-28 py-14">
      <Card>
        <CardHeader className="flex items-center flex-row justify-between gap-3">
          <div>
            <CardTitle>Edit signer</CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <Select
              defaultValue={parseInt(
                selected.data.threshold.toString()
              ).toString()}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Set your threshold" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Threshold</SelectLabel>
                  {[...Array(8)].map((_, i) => (
                    <SelectItem
                      key={i}
                      value={(i + 1).toString()}
                      disabled={
                        i + 1 >
                        selected.data.owners.filter(
                          (owner) =>
                            removeVisibleModifier(owner) !== ZERO_ADDRESS
                        ).length + addSignerList.length
                      }
                    >
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Dialog
              onOpenChange={(open) => {
                setNewSigner({ name: "", address: "" });
                setOpenDialog(open);
              }}
              open={openDialog}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <UserPlus2 />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Enter signer</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-left">
                      Signer name
                    </Label>
                    <Input
                      id="name"
                      className="col-span-3"
                      onChange={(e) =>
                        setNewSigner({ ...newSigner, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="wallet" className="text-left">
                      Signer wallet
                    </Label>
                    <Input
                      id="wallet"
                      className="col-span-3"
                      onChange={(e) =>
                        setNewSigner({ ...newSigner, address: e.target.value })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={() => {
                      if (newSigner.name.trim() === "" || newSigner.address.trim() === "") {
                        toast("Cannot empty")
                        return;
                      }
                      if (selected.data.owners.find(owner => removeVisibleModifier(owner) === newSigner.address)) {
                        toast("Cannot be the same")
                        return;
                      }
                      setAddSignerList((preve) => [...preve, newSigner]);
                      setOpenDialog(false);
                    }}
                  >
                    Add signer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Signer name</TableHead>
                <TableHead>Publickey</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selected.data.owners
                .filter(
                  (owner) => removeVisibleModifier(owner) !== ZERO_ADDRESS
                )
                .map((owner, index) => (
                  <GovernanceRow
                    key={index}
                    owner={removeVisibleModifier(owner)}
                    handleDelete={handleDelete}
                  />
                ))}
              {addSignerList.length > 0 &&
                addSignerList.map((item, index) => (
                  <GovernanceRow
                    key={index}
                    owner={removeVisibleModifier(item.address)}
                    name={item.name}
                    handleDelete={handleDelete}
                  />
                ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end items-center gap-3">
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </CardFooter>
      </Card>
    </section>
  );
};

export default Governance;
