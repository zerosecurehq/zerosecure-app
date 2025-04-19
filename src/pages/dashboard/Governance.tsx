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
import {
  getMappingValue,
  hashAddressToFieldFromServer,
  removeVisibleModifier,
  useCreateChangeGovernance,
  useCreateChangeRole,
  WALLET_MANAGER_PROGRAM_ID,
  ZERO_ADDRESS_HASHED_TO_FIELD,
} from "zerosecurehq-sdk";
import { ZERO_ADDRESS } from "../connect/CardWallet";
import GovernanceRow from "@/components/dashboard/governance/GovernanceRow";
import { Loader2, UserPlus2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { isArrayChangedById } from "@/utils";
import useAccount from "@/stores/useAccount";
import Warning from "@/components/ui/Warning";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";

function mapAddressToName(
  wallet: string,
  address: string
): {
  name: string;
  address: string;
} {
  const mappingNameObject = JSON.parse(
    localStorage.getItem("mappingName") || "{}"
  )[removeVisibleModifier(wallet)];
  return {
    name: mappingNameObject?.[removeVisibleModifier(address)],
    address,
  };
}

const Governance = () => {
  const { publicKey } = useWallet();
  const [newSignerList, setNewSignerList] = useState<
    Array<{ name: string; address: string }>
  >([]);
  const { createChangeGovernance, error, isProcessing, reset } =
    useCreateChangeGovernance();
  const {
    createChangeRole,
    error: changeRoleError,
    isProcessing: changeRoleIsProcessing,
    reset: changeRoleReset,
  } = useCreateChangeRole();
  const { selectedWallet } = useAccount();
  const [newSigner, setNewSigner] = useState({ name: "", address: "" });
  const [newManager, setNewManager] = useState({ name: "", address: "" });
  const [newThreshold, setNewThreshold] = useState("0");
  const [openDialog, setOpenDialog] = useState(false);
  let [isHasPermission, setIsHasPermission] = useState(false);
  let [managersList, setManagersList] = useState<
    Array<{ name: string; address: string }>
  >([]);
  let [adminWallet, setAdminWallet] = useState<string>("");

  const handleDeleteSigner = (publicKey: string) => {
    const deletedList = newSignerList.filter(
      (item) =>
        removeVisibleModifier(item.address) !== removeVisibleModifier(publicKey)
    );
    setNewSignerList(deletedList);
  };

  const handleDeleteManager = (publicKey: string) => {
    const deletedList = managersList.filter(
      (item) =>
        removeVisibleModifier(item.address) !== removeVisibleModifier(publicKey)
    );
    setManagersList(deletedList);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWallet) return;
    const mappingNameParser = JSON.parse(
      localStorage.getItem("mappingName") || "{}"
    );
    const signerObject = newSignerList.reduce((acc, curr) => {
      acc[curr.address] = curr.name;
      return acc;
    }, {} as Record<string, string>);
    mappingNameParser[
      removeVisibleModifier(selectedWallet.data.wallet_address)
    ] = signerObject;
    localStorage.setItem("mappingName", JSON.stringify(mappingNameParser));
    const oldOwners = selectedWallet.data.owners
      .map((owner) => {
        if (removeVisibleModifier(owner) !== ZERO_ADDRESS) {
          return { id: owner };
        }
      })
      .filter((item) => item !== undefined);
    const newOwners = newSignerList.map((item) => ({ id: item.address }));
    const isChanged =
      isArrayChangedById(oldOwners, newOwners) ||
      parseInt(newThreshold) !== parseInt(selectedWallet.data.threshold);
    if (!isChanged) return toast.error("No changes detected");
    toast(
      "Please wait while we prepare your transaction, it may take a few minutes..."
    );
    const txIdHash = await createChangeGovernance(
      selectedWallet,
      [...newSignerList.map((item) => removeVisibleModifier(item.address))],
      Number(newThreshold)
    );
    if (txIdHash) {
      toast("Governance updated successfully");
      reset();
    }
  };

  const handleChangeRole = async (
    type: "admin" | "managers",
    data: {
      newManagers?: string[];
      newAdmin?: string;
    }
  ) => {
    if (!selectedWallet) return;
    toast("Please wait while we prepare your transaction...");
    const txIdHash = await createChangeRole(selectedWallet, type, data);
    if (txIdHash) {
      toast("Role updated successfully");
      changeRoleReset();
    }
  };

  useEffect(() => {
    if (!publicKey || !selectedWallet) return;
    const checker = async () => {
      let myWalletOwnersHashedToField: string[] = [];
      for (let i = 0; i < selectedWallet.data.owners.length; i++) {
        myWalletOwnersHashedToField.push(
          await hashAddressToFieldFromServer(
            WalletAdapterNetwork.TestnetBeta,
            removeVisibleModifier(selectedWallet.data.owners[i])
          )
        );
      }
      let myWalletHashedToField = await hashAddressToFieldFromServer(
        WalletAdapterNetwork.TestnetBeta,
        publicKey
      );
      let multisigWalletHashedToField = await hashAddressToFieldFromServer(
        WalletAdapterNetwork.TestnetBeta,
        removeVisibleModifier(selectedWallet.data.wallet_address) as string
      );
      let walletAdminHashedToField = await getMappingValue(
        WalletAdapterNetwork.TestnetBeta,
        "admins",
        multisigWalletHashedToField,
        WALLET_MANAGER_PROGRAM_ID
      ).then((res) => res.result);

      let managersWalletHashedToFieldList = (await getMappingValue(
        WalletAdapterNetwork.TestnetBeta,
        "managers",
        multisigWalletHashedToField,
        WALLET_MANAGER_PROGRAM_ID
      ).then((res) => res.result)) as string;

      // get the admin and managers list in plain text
      let walletAdminPlainText = removeVisibleModifier(
        selectedWallet.data.owners[
          myWalletOwnersHashedToField.indexOf(
            walletAdminHashedToField as string
          )
        ]
      );
      let managersWalletListPlainText = managersWalletHashedToFieldList
        .replace(/[\[\]"\n]/g, "")
        .split(",")
        .map((field) => field.trim())
        .filter((field) => field !== ZERO_ADDRESS_HASHED_TO_FIELD)
        .map((field) => {
          return selectedWallet.data.owners[
            myWalletOwnersHashedToField.indexOf(field)
          ];
        })
        .map((wallet) => removeVisibleModifier(wallet));

      // mapping manager wallet to name
      const managerWithName = managersWalletListPlainText.map((manager) =>
        mapAddressToName(selectedWallet.data.wallet_address, manager)
      );

      // set the admin and managers list
      setAdminWallet(walletAdminPlainText);
      setManagersList(managerWithName);

      // check if the user is in the managers list or admin
      if (
        (managersWalletHashedToFieldList &&
          managersWalletHashedToFieldList.includes(myWalletHashedToField)) ||
        myWalletHashedToField === walletAdminHashedToField
      ) {
        setIsHasPermission(true);
      }
    };
    checker();
  }, [publicKey, selectedWallet]);

  useEffect(() => {
    if (error) {
      toast(error.message);
    }
    if (changeRoleError) {
      toast(changeRoleError.message);
    }
  }, [error, changeRoleError]);

  useEffect(() => {
    if (selectedWallet) {
      setNewThreshold(
        parseInt(selectedWallet?.data.threshold || "0").toString()
      );
      const signerOld = selectedWallet.data.owners
        .map((owner) => {
          if (removeVisibleModifier(owner) !== ZERO_ADDRESS) {
            return mapAddressToName(
              removeVisibleModifier(selectedWallet.data.wallet_address),
              removeVisibleModifier(owner)
            );
          }
        })
        .filter((item) => item !== undefined);
      setNewSignerList(signerOld);
    }
  }, [selectedWallet]);

  if (!selectedWallet) return null;

  if (!isHasPermission) {
    return (
      <section className="w-full overflow-auto px-28">
        <div className="py-4">
          <Warning msg={"You do not have permission to access this page."} />
        </div>
      </section>
    );
  }

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
        {/* @TODO: implement the edit admin function */}
        <CardHeader>
          <CardTitle>Edit Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            onChange={(e) => setAdminWallet(e.target.value)}
            value={adminWallet}
          />
          <div className="w-full flex justify-end">
            <Button
              disabled={changeRoleIsProcessing}
              onClick={() =>
                handleChangeRole("admin", {
                  newAdmin: adminWallet,
                })
              }
              variant="default"
              className="mt-4"
            >
              Change Admin
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex items-center flex-row justify-between gap-3">
          <div>
            <CardTitle>Edit Signers</CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={newThreshold}
              onValueChange={(value) => setNewThreshold(value.toString())}
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
                      disabled={i + 1 > newSignerList.length || isProcessing}
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
                <Button
                  variant="outline"
                  disabled={isProcessing || newSignerList.length >= 8}
                >
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
                      if (
                        newSigner.name.trim() === "" ||
                        newSigner.address.trim() === ""
                      ) {
                        toast("Cannot empty");
                        return;
                      }
                      if (
                        newSignerList.some(
                          (item) =>
                            removeVisibleModifier(item.address) ===
                            newSigner.address
                        )
                      ) {
                        toast("Cannot be the same");
                        return;
                      }
                      setNewSignerList((prev) => [...prev, newSigner]);
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
              {newSignerList.length > 0 &&
                newSignerList.map((item, index) => (
                  <GovernanceRow
                    key={index}
                    data={item}
                    isProcessing={isProcessing}
                    handleDelete={handleDeleteSigner}
                  />
                ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end items-center gap-3">
          <Button variant="outline">Cancel</Button>
          <Button disabled={isProcessing} onClick={handleSave}>
            {isProcessing ? <Loader2 className="animate-spin" /> : "Save"}
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader className="flex items-center flex-row justify-between gap-3">
          <div>
            <CardTitle>Edit Managers</CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <Dialog
              onOpenChange={(open) => {
                setNewManager({ name: "", address: "" });
                setOpenDialog(open);
              }}
              open={openDialog}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={isProcessing || newSignerList.length >= 8}
                >
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
                      Manager name
                    </Label>
                    <Input
                      id="name"
                      className="col-span-3"
                      onChange={(e) =>
                        setNewManager({ ...newManager, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="wallet" className="text-left">
                      Manager wallet
                    </Label>
                    <Input
                      id="wallet"
                      className="col-span-3"
                      onChange={(e) =>
                        setNewManager({
                          ...newManager,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={() => {
                      if (
                        newManager.name.trim() === "" ||
                        newManager.address.trim() === ""
                      ) {
                        toast("Cannot empty");
                        return;
                      }
                      if (adminWallet === newManager.address) {
                        toast(
                          "You already are the admin, don't need to add yourself as a manager"
                        );
                        return;
                      }
                      if (
                        managersList.some(
                          (item) =>
                            removeVisibleModifier(item.address) ===
                            newManager.address
                        )
                      ) {
                        toast("This manager already exists");
                        return;
                      }
                      setManagersList((prev) => [...prev, newManager]);
                      setOpenDialog(false);
                    }}
                  >
                    Add manager
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
                <TableHead>Manager name</TableHead>
                <TableHead>Publickey</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {managersList.length > 0 &&
                managersList.map((item, index) => (
                  <GovernanceRow
                    key={index}
                    data={item}
                    isProcessing={isProcessing}
                    handleDelete={handleDeleteManager}
                  />
                ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end items-center gap-3">
          <Button variant="outline">Cancel</Button>
          <Button
            disabled={changeRoleIsProcessing}
            onClick={() => {
              handleChangeRole("managers", {
                newManagers: managersList.map((item) => item.address),
              });
            }}
          >
            {changeRoleIsProcessing ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
};

export default Governance;
// @TODO: implement logic to updat admin and manager
