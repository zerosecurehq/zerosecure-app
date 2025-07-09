import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  Copy,
  Loader2,
  Loader2Icon,
  Plus,
  Share,
  Trash,
  UserRoundPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import {
  getRandomAddressFromServer,
  removeVisibleModifier,
  useCreateMultisigWallet,
  useGetWalletCreated,
  WalletRecord,
} from "zerosecurehq-sdk";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import useAccount from "@/stores/useAccount";
import { formatAleoAddress, getRandomGradient } from "@/utils";
import { WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";

interface Signer {
  name: string;
  address: string;
}

const NewAccountButton = ({ reset: resetGetWallet }: { reset: () => void }) => {
  const { publicKey } = useWallet();
  const DEFAULT_SIGNER = {
    name: "Me",
    address: publicKey ? removeVisibleModifier(publicKey as string) : "",
  };
  const [currentStep, setCurrentStep] = useState(1);
  const { setWallets, setSelectedWallet } = useAccount();
  const [signerList, setSignerList] = useState<Signer[]>([]);
  const [newSigner, setNewSigner] = useState<Signer>({
    name: "",
    address: "",
  });
  const [threshold, setThreshold] = useState("1");
  const { createMultisigWallet, error, isProcessing, txId, reset } =
    useCreateMultisigWallet();
  const { getWalletCreated } = useGetWalletCreated();
  const [walletName, setWalletName] = useState("");

  const handleCreateMultiWallet = async () => {
    try {
      if (!walletName) return;
      if (!publicKey) return;
      const network = WalletAdapterNetwork.TestnetBeta;
      const address = await getRandomAddressFromServer(network);
      const txHash = await createMultisigWallet({
        owners: [...signerList.map((signer) => signer.address)],
        threshold: Number(threshold),
        address,
      });
      if (txHash) {
        reset();
        toast.success("Wallet created successfully");
        setNewSigner({ name: "", address: "" });
        setSignerList([DEFAULT_SIGNER]);
        const nameParser = JSON.parse(localStorage.getItem("name") || "{}");
        nameParser[removeVisibleModifier(address)] = walletName;
        localStorage.setItem("name", JSON.stringify(nameParser));
        const mappingNameParse = JSON.parse(
          localStorage.getItem("mappingName") || "{}"
        );
        mappingNameParse[address] = Object.fromEntries(
          signerList.map((signer) => [signer.address, signer.name])
        );
        localStorage.setItem("mappingName", JSON.stringify(mappingNameParse));
        setWalletName("");
        const refreshWalletCreated: WalletRecord[] | void =
          await getWalletCreated();
        if (refreshWalletCreated) {
          setWallets(refreshWalletCreated);
          const newSelected = refreshWalletCreated.find(
            (wallet) => wallet.data.wallet_address === address
          );
          if (newSelected) {
            setSelectedWallet(newSelected);
          }
          resetGetWallet();
        }
        setCurrentStep(1);
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(`Error creating wallet ${error.message}`);
      reset();
    }
    if (txId) {
      setCurrentStep(4);
    }
  }, [error, txId]);

  return (
    <Dialog
      onOpenChange={() => {
        setCurrentStep(1);
        reset();
        setSignerList([DEFAULT_SIGNER]);
        setWalletName("");
        setNewSigner({ name: "", address: "" });
        setThreshold("1");
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          disabled={isProcessing}
        >
          {isProcessing ? <Loader2 className="animate-spin" /> : <Plus />}
          <div>{isProcessing ? "Processing..." : "New Account"}</div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Create a new account</DialogTitle>
          <DialogDescription>
            Please fill out the form below to create a new account.
          </DialogDescription>
        </DialogHeader>
        <section className="bg-gray-100 w-full h-full">
          <div className="w-full h-full">
            <div className="">
              <div className="border border-gray-300 bg-white rounded-md relative overflow-hidden">
                <div className="absolute inset-x-0 h-2 bg-gray-300" />
                <div
                  className={`absolute left-0 top-0 ${
                    currentStep === 1
                      ? "w-1/4"
                      : currentStep === 2
                      ? "w-1/2"
                      : currentStep === 3
                      ? "w-3/4"
                      : "w-full"
                  } h-2 bg-gray-900 transition-all duration-1000`}
                />
                {currentStep < 4 && (
                  <div className="px-3 py-6 border-b border-gray-300">
                    <div className="flex items-center gap-4">
                      <div className="h-6 w-6 p-4 bg-white border border-gray-200 text-sm font-semibold shadow rounded-md flex items-center justify-center">
                        {currentStep}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">
                          {
                            {
                              1: "Initialize the wallet setup",
                              2: "Initialize the wallet setup",
                              3: "Review the wallet setup",
                            }[currentStep]
                          }
                        </h3>
                        <p>
                          {
                            {
                              1: "Select a unique name for your wallet and carefully read through the terms and conditions before agreeing to proceed.",
                              2: "Determine the multisig threshold by choosing how many signatures are required to authorize transactions from your wallet.",
                              3: "Take a moment to carefully review all the details of your wallet setup to ensure everything is correct before finalizing.",
                            }[currentStep]
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {currentStep === 1 && (
                  <>
                    <div className="px-14 py-5 border-b border-gray-300">
                      <div className="space-y-5">
                        <div className="space-y-1.5">
                          <Label>Wallet Name</Label>
                          <Input
                            placeholder="my wallet name"
                            value={walletName}
                            onChange={(e) => setWalletName(e.target.value)}
                          />
                        </div>

                        <div className="flex space-x-1.5 items-center">
                          <Checkbox />
                          <p className="text-sm">
                            By continuing, you agreee to our{" "}
                            <span className="font-semibold underline">
                              terms of use
                            </span>{" "}
                            and{" "}
                            <span className="font-semibold underline">
                              privacy policy
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* 2 */}
                {currentStep === 2 && (
                  <>
                    <div className="px-4 py-5 border-b border-gray-300 space-y-2">
                      {signerList.length > 0 &&
                        signerList.map((signer, idx) => (
                          <div key={idx} className="relative w-full">
                            <Card className="shadow-sm hover:shadow-md transition-shadow border border-gray-200 rounded-lg p-3 pr-8 relative">
                              <CardHeader className="p-0 mb-1">
                                <CardTitle className="text-xs font-semibold text-gray-700">
                                  Signer {idx + 1}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="p-0 space-y-1">
                                <p className="text-sm font-medium text-gray-800 truncate">
                                  Signer name: {signer.name}
                                </p>
                                <p className="text-sm text-gray-500 truncate max-w-md">
                                  Signer wallet:{" "}
                                  {formatAleoAddress(signer.address)}
                                </p>
                              </CardContent>
                            </Card>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-1/2 right-2 -translate-y-1/2 text-red-500 hover:text-red-700"
                              onClick={() =>
                                setSignerList(
                                  signerList.filter((_, i) => i !== idx)
                                )
                              }
                            >
                              <Trash size={14} />
                            </Button>
                          </div>
                        ))}
                    </div>

                    <div className="px-4 py-3 space-y-3">
                      <Label>Add Signer</Label>
                      <Input
                        placeholder="Signer Name"
                        className="w-full"
                        value={newSigner.name}
                        onChange={(e) =>
                          setNewSigner((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />

                      <Input
                        placeholder="Signer Wallet: aleo12s.asc"
                        className="w-full"
                        value={newSigner.address}
                        onChange={(e) =>
                          setNewSigner((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                      />

                      <Button
                        variant="ghost"
                        className="w-full flex justify-center"
                        onClick={() => {
                          console.log("newSigner", newSigner);
                          if (
                            !newSigner.name.trim() ||
                            !newSigner.address.trim()
                          ) {
                            toast.error(
                              "Please enter signer name and address before adding!"
                            );
                            return;
                          }

                          if (
                            signerList.some(
                              (s) => s.address === newSigner.address
                            )
                          ) {
                            toast.error("This address already exists!");
                            return;
                          }

                          if (signerList.length >= 8) {
                            toast.error("Maximum 8 signers allowed!");
                            return;
                          }

                          setSignerList([...signerList, newSigner]);
                          setNewSigner({ name: "", address: "" });
                        }}
                      >
                        <UserRoundPlus /> Add Signer
                      </Button>
                    </div>

                    <div className="px-14 py-5 border-t border-gray-300 space-y-5">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg">Threshold</h3>
                          <AlertCircle size={16} className="text-gray-500" />
                        </div>
                        <p>Choose your multisig-wallet threshold</p>
                      </div>

                      <div className="flex items-center">
                        <Select
                          onValueChange={(value) => {
                            if (parseInt(value) - 1 > signerList.length) {
                              toast.error(
                                "Threshold must be less than or equal to the number of signers"
                              );
                              return;
                            }
                            setThreshold(value);
                          }}
                          value={threshold}
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
                                  disabled={i + 1 > signerList.length}
                                >
                                  {i + 1}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}

                {/* 3 */}
                {currentStep === 3 && (
                  <>
                    <div className="px-14 py-5 border-b border-gray-300 space-y-5">
                      <div className="flex items-center gap-3">
                        <div className="w-1/3">Name</div>
                        <div className="w-2/3">
                          <div className="font-semibold">
                            {walletName.trim()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-1/3">Signers</div>
                        <div className="w-2/3 space-y-1.5">
                          {signerList.map((signer, idx) => (
                            <div className="flex items-center gap-2" key={idx}>
                              <div
                                className={`w-8 h-8 rounded-md ${getRandomGradient()}`}
                              />
                              <div className="flex-1 truncate">
                                {formatAleoAddress(signer.address)}
                              </div>
                              <div className="flex items-center gap-2 text-gray-500">
                                <Copy
                                  className="cursor-pointer"
                                  size={16}
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      signer.address
                                    );
                                    toast.info("Copied to clipboard");
                                  }}
                                />
                                <Share className="cursor-pointer" size={16} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-1/3">Threshold</div>
                        <div className="w-2/3 font-semibold">
                          <Badge>{threshold}</Badge> / {signerList.length}{" "}
                          signer
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* 4 */}
                {currentStep === 4 && (
                  <div className="p-5 space-y-6 border-t border-b border-gray-200">
                    <div className="w-full flex justify-center items-center ">
                      <div className="p-1">
                        <div className="w-full flex justify-center py-6">
                          <div className="loader"></div>
                        </div>
                        <span className="font-semibold text-2xl block w-full text-center">
                          Your transaction is being processed...
                        </span>
                        <span className="block w-full text-center text-sm text-gray-500 mt-3">
                          Please be patient as it may take a few minutes for
                          your transaction to be completed.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep < 4 && (
                  <div className="px-14 py-5 flex items-center justify-between">
                    {currentStep === 1 ? (
                      <div></div>
                    ) : (
                      <Button
                        onClick={() => {
                          if (currentStep > 1) {
                            setCurrentStep(currentStep - 1);
                          }
                        }}
                        disabled={isProcessing}
                      >
                        Back
                      </Button>
                    )}
                    <Button
                      variant={"outline"}
                      onClick={() => {
                        if (currentStep === 1) {
                          if (walletName.trim() === "") {
                            toast.error("Please enter a wallet name");
                            return;
                          }
                        }
                        if (currentStep < 3) {
                          setCurrentStep(currentStep + 1);
                        }
                        if (currentStep === 3) {
                          handleCreateMultiWallet();
                        }
                      }}
                      disabled={isProcessing}
                    >
                      {currentStep === 3 ? (
                        isProcessing ? (
                          <Loader2Icon className="animate-spin" />
                        ) : (
                          "Create Wallet"
                        )
                      ) : (
                        "Next"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default NewAccountButton;
