import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  Copy,
  Plus,
  Share,
  Trash,
  UserRoundPlus,
} from "lucide-react";
import { useState } from "react";
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

interface option {
  name: string;
  id: number;
}

interface signer {
  id: number;
  name: string;
  address: string;
}

const NewAccountButton = () => {
  const [selectedOpen, setSelectOpen] = useState(false);
  const [selected, setSelected] = useState<option[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [signer, setSigner] = useState<signer>({
    name: "",
    address: "",
    id: 1,
  });
  const [signerList, setSignerList] = useState<signer[]>([]);
  const [checked, setChecked] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus /> New Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
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
                  } h-2 bg-blue-400 transition-all duration-1000`}
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
                          <Input placeholder="my wallet name" />
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
                    <div className="px-4 py-5 border-b border-gray-300">
                      <div className="space-y-5">
                        {[...Array(signerList.length + 1)].map((_, idx) => (
                          <div key={idx} className="flex items-center gap-3 ">
                            <div className="w-full relative border border-gray-300 rounded-md p-4 space-y-1.5">
                              <Label>Signer 1</Label>
                              <Input
                                placeholder="Signer Name"
                                className="w-1/3"
                              />
                              <Input placeholder="Signer Wallet: aleo12s.asc" />
                              <div className="flex justify-end space-x-1.5">
                                <Button variant={"ghost"}>
                                  <Trash />
                                </Button>
                                <Button variant={"ghost"}>
                                  <UserRoundPlus />
                                </Button>
                              </div>
                            </div>
                            {signerList.length > 1 && (
                              <div className="hover:text-red-500 cursor-pointer">
                                <Trash size={16} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="px-14 py-5 border-b border-gray-300 space-y-5">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg">Threshold</h3>
                          <AlertCircle size={16} className="text-gray-500" />
                        </div>
                        <p className="">
                          Choose your multisig-wallet threshold
                        </p>
                      </div>

                      <div className="flex items-center">
                        <Select>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Set your threshold" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Threshold</SelectLabel>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5</SelectItem>
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
                            Affectionate Ethereum Safe
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-1/3">Signers</div>
                        <div className="w-2/3 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-md bg-gradient-primary" />
                            <div className="flex-1 truncate">0x1230000000</div>
                            <div className="flex items-center gap-2 text-gray-500">
                              <Copy className="cursor-pointer" size={16} />
                              <Share className="cursor-pointer" size={16} />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-md bg-gradient-primary" />
                            <div className="flex-1 truncate">0x1230000000</div>
                            <div className="flex items-center gap-2 text-gray-500">
                              <Copy className="cursor-pointer" size={16} />
                              <Share className="cursor-pointer" size={16} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-1/3">Threshold</div>
                        <div className="w-2/3 font-semibold">
                          <Badge>1</Badge> / 1 signer
                        </div>
                      </div>
                    </div>
                  </>
                )}

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
                      >
                        Back
                      </Button>
                    )}
                    <Button
                      variant={"outline"}
                      onClick={() => {
                        if (currentStep < 4) {
                          setCurrentStep(currentStep + 1);
                        }
                      }}
                    >
                      {currentStep === 3 ? "Create Wallet" : "Next"}
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
