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

import { useEffect, useState } from "react";
import {
  CREDITS_TOKEN_ID,
  removeVisibleModifier,
  useCreateTransaction,
} from "zerosecurehq-sdk";
import { toast } from "sonner";
import useAccount from "@/stores/useAccount";
import { Loader2 } from "lucide-react";
import { creditsToMicroCredits, formatAleoAddress } from "@/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fakeTokens } from "../transactions/Token";

const Page1 = ({
  setAmount,
  setRecipient,
  setTokenSelected,
}: {
  setAmount: (amount: number) => void;
  setRecipient: (address: string) => void;
  setTokenSelected: (token: string) => void;
}) => {
  return (
    <div className="p-5 space-y-3 border-t border-b border-gray-200">
      <Warning
        msg={
          "Do not directly send aleo credits to multisig address because it is virtual and not exit in the blockchain."
        }
      />
      <div className="flex- space-y-1.5">
        <Label>Recipient address</Label>
        <Input
          placeholder="aleo1qz8...da2s"
          onChange={(e) => setRecipient(e.target.value)}
        />
      </div>
      <div>
        <Label>Select token</Label>
        <Select onValueChange={(value) => setTokenSelected(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a...." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select a token</SelectLabel>
              <SelectItem value={CREDITS_TOKEN_ID}>Remove token</SelectItem>
              {fakeTokens.map((token) => (
                <SelectItem value={token.data.token_id} key={token.id}>
                  {token.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex- space-y-1.5">
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
  recipient,
  amount,
}: {
  feeType: "public" | "private";
  setFeeType: (type: "public" | "private") => void;
  recipient: string;
  amount: number;
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
          <span className="font-semibold">{amount}</span>
          <span className="text-xl font-mono">.00 Aleo</span>
        </div>
      </div>
      <div className="w-full flex items-center">
        <span className="opacity-75">Confirmed </span>
        <div
          style={{
            flex: "1 1 auto",
            borderBottom: `3px dotted #ccc`,
            height: "3px",
            maskImage: "linear-gradient(90deg, transparent, #ccc, transparent)",
          }}
        ></div>
        <span>0 of 2</span>
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
        <span>{formatAleoAddress(removeVisibleModifier(recipient))}</span>
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

const NewTransactionButton = ({
  text = "New Transaction",
  className = "",
}: {
  text?: string;
  className?: string;
}) => {
  const [step, setStep] = useState(1);
  const [feeType, setFeeType] = useState<"public" | "private">("public");
  const { selectedWallet } = useAccount();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);
  const { createTransaction, error, isProcessing, reset, txId } =
    useCreateTransaction();
  const [tokenSelected, setTokenSelected] = useState(CREDITS_TOKEN_ID);
  const [openTransfer, setOpenTransfer] = useState(false);

  const handleCreateTransaction = async () => {
    if (!selectedWallet) return;
    const { avatar, ...walletWithoutAvatar } = selectedWallet;
    // setTimeout(() => {
    //   console.log(walletWithoutAvatar, recipient, credisToMicrocredis(amount));
    // }, 1000);

    const txHash = await createTransaction(
      walletWithoutAvatar,
      tokenSelected,
      recipient,
      creditsToMicroCredits(amount)
    );

    if (txHash) {
      reset();
      setAmount(0);
      toast("Create transaction successfully");
      setRecipient("");
      setTokenSelected("");
      setOpenTransfer(false);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message);
      reset();
    }
    if (txId) {
      setStep(3);
    }
  }, [error, txId]);

  return (
    <Dialog
      onOpenChange={(value) => {
        setStep(1);
        setFeeType("public");
        setRecipient("");
        setAmount(0);
        reset();
        setTokenSelected(CREDITS_TOKEN_ID);
        setOpenTransfer(value);
      }}
      open={openTransfer}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={className}
          disabled={isProcessing}
          onClick={() => setOpenTransfer(true)}
        >
          {isProcessing ? <Loader2 className="animate-spin" /> : text}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create a new transaction</DialogTitle>
          <DialogDescription>
            Please fill out the form below to create a new transaction.
          </DialogDescription>
        </DialogHeader>
        <section className="bg-gray-100 w-full relative flex justify-center items-center h-full">
          <div className="inset-0 flex justify-center items-center w-full">
            <div className="col-span-2 bg-white rounded-md relative">
              {
                {
                  1: (
                    <Page1
                      setRecipient={setRecipient}
                      setAmount={setAmount}
                      setTokenSelected={setTokenSelected}
                    />
                  ),
                  2: (
                    <Page2
                      feeType={feeType}
                      setFeeType={setFeeType}
                      recipient={recipient}
                      amount={amount}
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
                        if (step === 1 && (recipient === "" || amount === 0)) {
                          toast("Please fill out all the fields.");
                          return;
                        } else if (step === 1 && recipient && amount) {
                          if (amount < 0) {
                            toast("Amount must be greater than 0.");
                            return;
                          }
                          setStep(2);
                        }
                        if (step === 2) {
                          handleCreateTransaction();
                        }
                      }}
                      variant={"outline"}
                      disabled={isProcessing}
                    >
                      {step === 2 ? (
                        isProcessing ? (
                          <Loader2 />
                        ) : (
                          "Transfer"
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

export default NewTransactionButton;
