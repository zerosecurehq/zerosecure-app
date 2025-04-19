import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Warning from "@/components/ui/Warning";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import useAccount, { ExtendedWalletRecord } from "@/stores/useAccount";
import {
  creditsToMicroCredits,
  formatAleoAddress,
  microCreditsToCredits,
} from "@/utils";
import {
  CREDITS_TOKEN_ID,
  removeVisibleModifier,
  useCreateDeposit,
  useGetCreditsRecord,
} from "zerosecurehq-sdk";
import { Loader2 } from "lucide-react";
import { useGetTokenRecord } from "zerosecurehq-sdk/dist/useGetTokenRecord";
import useToken from "@/stores/useToken";

const Page1 = ({
  setAmount,
  typeRecord,
  setTypeRecord,
  setTokenSelected,
}: {
  setAmount: (amount: number) => void;
  typeRecord: string;
  setTypeRecord: Dispatch<SetStateAction<"credits" | "token">>;
  setTokenSelected: (token: string) => void;
}) => {
  const { tokens } = useToken();
  return (
    <div className="p-5 space-y-6 border-t border-b border-gray-200">
      <Warning
        msg={
          "Do not directly send aleo credits to multisig address because it is virtual and not exit in the blockchain."
        }
      />
      <div className="flex- space-y-2">
        <div>
          <Label>Type of deposit</Label>
          <Select
            onValueChange={(value) => {
              setTypeRecord(value as "credits" | "token");
            }}
            defaultValue={"credits"}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select deposit type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select deposit type</SelectLabel>
                <SelectItem value="credits">Credits</SelectItem>
                <SelectItem value="token">Token</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        {typeRecord === "token" && (
          <>
            <Label>Select token</Label>
            <Select onValueChange={(value) => setTokenSelected(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a...." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select a token</SelectLabel>
                  {tokens.map((token) => (
                    <SelectItem value={token.token_id} key={token.token_id}>
                      {token.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </>
        )}
      </div>
      <div>
        <Label>Amount</Label>
        <Input
          type="number"
          placeholder="0"
          onChange={(e) => setAmount(Number(e.target.value))}
          min={0}
        />
      </div>
    </div>
  );
};

const Page2 = ({
  feeType,
  setFeeType,
  depositType,
  setDepositType,
  amount,
  selectedWallet,
}: {
  feeType: "public" | "private";
  setFeeType: (type: "public" | "private") => void;
  depositType: "public" | "private";
  setDepositType: (type: "public" | "private") => void;
  amount: number;
  selectedWallet: ExtendedWalletRecord;
}) => {
  return (
    <div className="p-5 space-y-6 border-t border-b border-gray-200">
      <Warning
        msg={
          "Do not directly send aleo credits to multisig address because it is virtual and not exit in the blockchain."
        }
      />
      <div className="w-full flex justify-center items-center ">
        <div className="p-1 rounded-md text-3xl">
          {" "}
          <span className="font-semibold">{Number(amount)} Aleo</span>
          {/* <span className="text-xl font-mono">.44 Aleo</span> */}
        </div>
      </div>
      <div className="w-full flex items-center">
        <span className="opacity-75">To</span>
        <div
          style={{
            flex: "1 1 auto",
            borderBottom: `3px dotted #ccc`,
            height: "3px",
            maskImage: "linear-gradient(90deg, transparent, #ccc, transparent)",
          }}
        ></div>
        <span>
          {formatAleoAddress(
            removeVisibleModifier(selectedWallet.data.wallet_address)
          )}
        </span>
      </div>
      <div className="w-full flex items-center">
        <span className="opacity-75">Execution Fee</span>
        <div
          style={{
            flex: "1 1 auto",
            borderBottom: `3px dotted #ccc`,
            height: "3px",
            maskImage: "linear-gradient(90deg, transparent, #ccc, transparent)",
          }}
        ></div>
        <span>0.32 Aleo</span>
      </div>
      <div className="w-full flex items-center">
        <span className="opacity-75">Deposit Type</span>
        <div
          style={{
            flex: "1 1 auto",
            borderBottom: `3px dotted #ccc`,
            height: "3px",
            maskImage: "linear-gradient(90deg, transparent, #ccc, transparent)",
          }}
        ></div>
        <div className="gap-2 flex">
          <Button
            variant={depositType === "public" ? "default" : "outline"}
            onClick={() => setDepositType("public")}
          >
            Public
          </Button>
          <Button
            variant={depositType === "private" ? "default" : "outline"}
            onClick={() => setDepositType("private")}
          >
            Private
          </Button>
        </div>
      </div>
      <div className="w-full flex items-center">
        <span className="opacity-75">Fee Type</span>
        <div
          style={{
            flex: "1 1 auto",
            borderBottom: `3px dotted #ccc`,
            height: "3px",
            maskImage: "linear-gradient(90deg, transparent, #ccc, transparent)",
          }}
        ></div>
        <div className="gap-2 flex">
          <Button
            variant={feeType === "public" ? "default" : "outline"}
            onClick={() => setFeeType("public")}
          >
            Public
          </Button>
          <Button
            variant={feeType === "private" ? "default" : "outline"}
            onClick={() => setFeeType("private")}
          >
            Private
          </Button>
        </div>
      </div>
    </div>
  );
};

const Page3 = () => {
  return (
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
            Please be patient as it may take a few minutes for your transaction
            to be completed.
          </span>
        </div>
      </div>
    </div>
  );
};

const DepositButton = ({
  text = "Deposit",
  className = "",
}: {
  text?: string;
  className?: string;
}) => {
  const [step, setStep] = useState(1);
  const [feeType, setFeeType] = useState<"public" | "private">("private");
  const [depositType, setDepositType] = useState<"public" | "private">(
    "private"
  );
  const [amount, setAmount] = useState(0);
  const { createDeposit, error, isProcessing, reset, txId } = useCreateDeposit({
    feePrivate: feeType === "private",
  });
  const { selectedWallet } = useAccount();
  const { getCreditsRecord } = useGetCreditsRecord();
  const [typeRecord, setTypeRecord] = useState<"credits" | "token">("credits");
  const [tokenSelected, setTokenSelected] = useState("");
  const [openDeposit, setOpenDeposit] = useState(false);
  const {
    error: errorToken,
    getTokenRecord,
    reset: resetToken,
  } = useGetTokenRecord();

  const handleDeposit = async () => {
    if (amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    if (depositType === "public" && selectedWallet) {
      const txHash = await createDeposit(
        typeRecord === "credits" ? CREDITS_TOKEN_ID : tokenSelected,
        removeVisibleModifier(selectedWallet.data.wallet_address),
        creditsToMicroCredits(amount)
      );
      if (txHash) {
        reset();
        toast.success("Desposit successful");
        setAmount(0);
        setTokenSelected("");
        setTypeRecord("credits");
        setOpenDeposit(false);
      }
    } else if (depositType === "private" && selectedWallet) {
      let creditsRecord;
      let tokenRecord;
      if (typeRecord === "credits") {
        const record = await getCreditsRecord();
        if (!record) return toast.error("Credits record not found");
        creditsRecord = record.find(
          (item) =>
            microCreditsToCredits(parseInt(item.data.microcredits)) >= amount
        );
        if (!creditsRecord) {
          setStep(1);
          return toast.error("Not enough private credits");
        }
      } else if (typeRecord === "token") {
        const tokenRecords = await getTokenRecord(tokenSelected);
        if (!tokenRecords) {
          setStep(1);
          return toast.error("Tokens not found");
        }
        tokenRecord = tokenRecords.find(
          (item) => microCreditsToCredits(parseInt(item.data.amount)) >= amount
        );
        if (!tokenRecord) {
          setStep(1);
          return toast.error("No enough tokens");
        }
      }
      const txHash = await createDeposit(
        typeRecord === "credits" ? CREDITS_TOKEN_ID : tokenSelected,
        removeVisibleModifier(selectedWallet.data.wallet_address),
        creditsToMicroCredits(amount),
        typeRecord === "credits" ? creditsRecord : tokenRecord
      );
      if (txHash) {
        reset();
        toast.error(`Deposit ${amount} ${typeRecord} successful`);
        setAmount(0);
        setTokenSelected("");
        setTypeRecord("credits");
        setOpenDeposit(false);
      }
    }
  };

  useEffect(() => {
    if (errorToken) {
      toast.error(`Error despositing ${error.message}`);
      resetToken();
    }
  }, [errorToken]);

  useEffect(() => {
    if (error) {
      toast.error(`Error despositing ${error.message}`);
      reset();
    }
    if (txId) {
      setStep(3);
    }
  }, [error, txId]);

  console.log("depositType", depositType);

  return (
    <Dialog
      onOpenChange={(value) => {
        setOpenDeposit(value);
        setStep(1);
        setAmount(0);
        setDepositType("private");
        setFeeType("private");
        setTokenSelected("");
        reset();
      }}
      open={openDeposit}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={className}
          disabled={isProcessing}
          onClick={() => setOpenDeposit(true)}
        >
          {isProcessing ? <Loader2 className="animate-spin" /> : text}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Deposit funds to wallet</DialogTitle>
          <DialogDescription>
            Please fill out the form below to deposit funds.
          </DialogDescription>
        </DialogHeader>
        <section className="bg-gray-100 w-full relative flex justify-center items-center h-full">
          <div className="inset-0 flex justify-center items-center w-full">
            <div className="col-span-2 bg-white rounded-md relative">
              {
                {
                  1: (
                    <Page1
                      setAmount={setAmount}
                      typeRecord={typeRecord}
                      setTypeRecord={setTypeRecord}
                      setTokenSelected={setTokenSelected}
                    />
                  ),
                  2: (
                    <Page2
                      depositType={depositType}
                      setDepositType={setDepositType}
                      feeType={feeType}
                      setFeeType={setFeeType}
                      amount={amount}
                      selectedWallet={selectedWallet!}
                    />
                  ),
                  3: <Page3 />,
                }[step]
              }
              {/* main */}
              <div className="p-5">
                <div className="flex justify-between flex-row-reverse">
                  {step <= 2 && (
                    <Button
                      onClick={() => {
                        if (step === 2) {
                          handleDeposit();
                          return;
                        }
                        if (step === 1) {
                          if (amount <= 0) {
                            toast.error(
                              "Please enter an amount greater than 0"
                            );
                            return;
                          }
                        }
                        setStep(step + 1);
                      }}
                      variant={"outline"}
                      disabled={isProcessing}
                    >
                      {step === 2 ? (
                        isProcessing ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          "Deposit"
                        )
                      ) : (
                        "Next"
                      )}
                    </Button>
                  )}
                  {step > 1 && step <= 2 && (
                    <Button
                      onClick={() => setStep(step - 1)}
                      variant={"outline"}
                      disabled={isProcessing}
                    >
                      Back
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default DepositButton;
