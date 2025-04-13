import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Copy, Share, Trash, UserRoundPlus } from "lucide-react";
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

interface option {
  name: string;
  id: number;
}

interface signer {
  id: number;
  name: string;
  address: string;
}

const Account = () => {
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
    <section className="bg-gray-100 w-full px-28 py-10">
      <div className="mt-8">
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
            {currentStep === 1 && (
              <>
                <div className="px-3 py-6 border-b border-gray-300">
                  <div className="flex items-center gap-4">
                    <div className="h-6 w-6 p-0 bg-black text-white rounded-full flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Set up the basics</h3>
                      <p>
                        Give a name to your account and select which networks to
                        deloy it on
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-14 py-5 border-b border-gray-300">
                  <div className="space-y-5">
                    {/* <div className="relative border border-gray-300 rounded-md p-4">
                      <input
                        type="text"
                        placeholder="Affectionate Ethereum Safe"
                        className="w-full focus:outline-none pr-14"
                      />
                      <div className="text-gray-400 p-1 absolute top-0 left-2 -translate-y-1/2 bg-white">
                        Name
                      </div>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <AlertCircle />
                      </div>
                    </div> */}
                    <div className="space-y-1.5">
                      <Label>Wallet Name</Label>
                      <Input placeholder="my wallet name" />
                    </div>
                    {/* <div>
                      <h4 className="font-semibold text-lg">Select Networks</h4>
                      <p className="text-sm">
                        Choose which networks you want your account to be active
                        on. You can add more networks later.
                      </p>
                    </div>
                    <div className="border border-gray-300 rounded-md p-4 relative">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 flex items-center gap-2 flex-wrap">
                          {selected.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1 rounded-full px-1 py-1 border border-gray-300 w-32"
                            >
                              <div className="h-6 w-6 rouned-full bg-blue-400 rounded-full" />
                              <div className="flex-1 overflow-hidden truncate">
                                {item.name}
                              </div>
                              <div
                                className="h-5 w-5 rouned-full bg-gray-300 rounded-full text-white flex items-center justify-center hover:bg-gray-200 cursor-pointer"
                                onClick={() =>
                                  setSelected(
                                    selected.filter(
                                      (select) => select.name !== item.name
                                    )
                                  )
                                }
                              >
                                <X size={16} />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div
                          className="cursor-pointer "
                          onClick={() => setSelectOpen(!selectedOpen)}
                        >
                          <ChevronDown />
                        </div>
                      </div>

                      {selectedOpen && (
                        <div className="absolute top-full left-0 w-full border border-gray-300 mt-2 overflow-y-scroll h-32 p-1 space-y-1 rounded-md bg-gray-100">
                          {SELECTION.map((item, idx) => (
                            <div
                              key={idx}
                              className={`border border-white bg-white rounded-md p-1 hover:bg-gray-300 cursor-pointer text-start w-full`}
                              onClick={() => {
                                if (
                                  !selected.some(
                                    (select) => select.name === item.name
                                  )
                                ) {
                                  setSelected([...selected, item]);
                                }
                              }}
                            >
                              {item.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div> */}
                    {"@TODO: make sure user have agreed to the terms"}
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
                <div className="px-3 py-6 border-b border-gray-300">
                  <div className="flex items-center gap-4 justify-center">
                    <div className="w-8 h-6 p-0 bg-black text-white rounded-full flex items-center justify-center">
                      2
                    </div>
                    <div>
                      <h3 className="flex-1 text-xl font-bold">
                        Set up the basics
                      </h3>
                      <p>
                        Set the signer wallets of your Safe Account and how many
                        need to confirm to execute a valid transaction.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-14 py-5 border-b border-gray-300">
                  <div className="space-y-5">
                    {[...Array(signerList.length + 1)].map((_, idx) => (
                      <div key={idx} className="flex items-center gap-3 ">
                        <div className="w-full relative border border-gray-300 rounded-md p-4 space-y-1.5">
                          <Label>Signer 1</Label>
                          <Input placeholder="Signer Name" className="w-1/3" />
                          <Input placeholder="Signer Wallet: aleo12s.asc" />
                          <div className="flex justify-end space-x-1.5">
                            <Button variant={"destructive"}>
                              <Trash />
                            </Button>
                            <Button variant={"outline"}>
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

                    {/* <div
                      className="flex items-center gap-2 font-bold cursor-pointer hover:bg-gray-200 w-fit p-2 rounded-md"
                      onClick={() => {
                        if (signer.name.trim() && signer.address.trim()) {
                          setSignerList([...signerList, signer]);
                          setSigner({
                            name: "",
                            address: "",
                            id: signerList.length + 1,
                          });
                        }
                      }}
                    >
                      <Plus />
                      <div>Add new signer</div>
                    </div> */}
                  </div>
                </div>

                <div className="px-14 py-5 border-b border-gray-300 space-y-5">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg">Threshold</h3>
                      <AlertCircle size={16} className="text-gray-500" />
                    </div>
                    <p className="">Choose your multisig-wallet threshold</p>
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
                <div className="px-3 py-6 border-b border-gray-300">
                  <div className="flex items-center gap-4 justify-center">
                    <div className="w-8 h-6 p-0 bg-black text-white rounded-full flex items-center justify-center">
                      3
                    </div>
                    <div>
                      <h3 className="flex-1 text-xl font-bold">Review</h3>
                      <p>
                        You're about to create a new Safe Account and will have
                        to confirm the transaction with your connected wallet.
                      </p>
                    </div>
                  </div>
                </div>

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
                          <Copy size={16} />
                          <Share size={16} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-md bg-gradient-primary" />
                        <div className="flex-1 truncate">0x1230000000</div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Copy size={16} />
                          <Share size={16} />
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

                {/* <div className="px-14 py-5 border-b border-gray-300 space-y-2">
                  <h2 className="text-xl font-bold">Before we continue...</h2>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Check size={18} />
                      <p className="text-md flex-1">
                        There will be a one-time activation fee
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Check size={18} />
                      <p className="text-md flex-1">
                        If tou choose to pay later, the fee will be included
                        with the first transaction you make
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Check size={18} />
                      <p className="text-md flex-1">
                        Safe doesn't profit from the fees
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex-1 p-3 rounded-md flex items-center gap-2 ${
                        checked
                          ? "border-black border-2"
                          : "border-gray-400 border"
                      }`}
                    >
                      <input
                        type="radio"
                        className="radio"
                        checked={checked}
                        onChange={() => setChecked(true)}
                      />
                      <div>
                        <h4 className="font-semibold">Pay now</h4>
                        <div
                          className={`${
                            checked ? "text-black" : "text-gray-400"
                          }`}
                        >
                          # 000038 ETH
                        </div>
                      </div>
                    </div>
                    <div
                      className={`flex-1 p-3 rounded-md flex items-center gap-2 ${
                        !checked
                          ? "border-black border-2"
                          : "border-gray-400 border"
                      }`}
                    >
                      <input
                        type="radio"
                        className="radio"
                        checked={!checked}
                        onChange={() => setChecked(false)}
                      />
                      <div>
                        <h4 className="font-semibold">Pay later</h4>
                        <div
                          className={`${
                            !checked ? "text-black" : "text-gray-400"
                          }`}
                        >
                          # 000038 ETH
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
              </>
            )}
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
              {currentStep < 3 ? (
                <Button
                  variant={"outline"}
                  onClick={() => {
                    if (currentStep < 3) {
                      setCurrentStep(currentStep + 1);
                    }
                  }}
                >
                  Next
                </Button>
              ) : (
                <div className="px-6 py-2 border-2 border-black bg-black rounded-md font-semibold cursor-pointer text-white hover:bg-white hover:text-black transition-colors duration-300">
                  Create account
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Account;
