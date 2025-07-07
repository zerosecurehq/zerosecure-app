import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  BASE_FEE,
  CREDITS_TOKEN_ID,
  getTokenMetadata,
  removeVisibleModifier,
  TokenMetadata,
  useCreateTransaction,
} from "zerosecurehq-sdk";
import { toast } from "sonner";
import useAccount, { ExtendedWalletRecord } from "@/stores/useAccount";
import { Loader2 } from "lucide-react";
import {
  convertAddressToZeroSecureAddress,
  creditsToMicroCredits,
  formatAleoAddress,
  microCreditsToCredits,
} from "@/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useToken from "@/stores/useToken";
import { WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";

const Page1 = ({
  tokens,
  setAmount,
  setRecipient,
  setTokenSelected,
  typeRecord,
  setTypeRecord,
}: {
  tokens: TokenMetadata[];
  setAmount: (amount: number) => void;
  setRecipient: (address: string) => void;
  setTokenSelected: (token: string) => void;
  typeRecord: string;
  setTypeRecord: (type: "credits" | "token") => void;
}) => {
  return (
    <div className="p-5 space-y-3 border-t border-b border-gray-200">
      <div className="flex- space-y-2">
        <div>
          <Label>Type of transfer</Label>
          <Select
            onValueChange={(value) => {
              setTypeRecord(value as "credits" | "token");
            }}
            defaultValue={"credits"}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a...." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select transfer type</SelectLabel>
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
                <SelectValue placeholder="Select a token" />
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
      <div className="flex- space-y-1.5">
        <Label>Recipient address</Label>
        <Input
          placeholder="aleo1qz8...da2s"
          onChange={(e) => setRecipient(e.target.value)}
        />
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
  typeRecord,
  selectedWallet,
  tokenSelected,
}: {
  feeType: "public" | "private";
  setFeeType: (type: "public" | "private") => void;
  recipient: string;
  amount: number;
  typeRecord: "credits" | "token";
  selectedWallet: ExtendedWalletRecord | null;
  tokenSelected: string;
}) => {
  let [unit, setUnit] = useState("Aleo");
  let execitionFee = microCreditsToCredits(
    typeRecord === "credits"
      ? BASE_FEE.execute_aleo_transfer
      : BASE_FEE.execute_token_transfer
  );
  useEffect(() => {
    const setTokenUnit = async () => {
      if (typeRecord === "token" && tokenSelected) {
        let tokenMetadata = await getTokenMetadata(
          WalletAdapterNetwork.TestnetBeta,
          tokenSelected
        );
        if (tokenMetadata) {
          setUnit(tokenMetadata.symbol);
        }
      }
    };
    setTokenUnit();
  }, [typeRecord, tokenSelected]);
  return (
    <div className="p-5 space-y-6 border-t border-b border-gray-200">
      <div className="w-full flex justify-center items-center ">
        <div className="p-1 rounded-md text-3xl">
          {" "}
          <span className="font-semibold">{amount}</span>
          <span className="text-xl font-mono">.00 {unit}</span>
        </div>
      </div>
      <div className="w-full flex items-center">
        <span className="opacity-75">From </span>
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
            convertAddressToZeroSecureAddress(
              removeVisibleModifier(selectedWallet?.data.wallet_address || "")
            )
          )}
        </span>
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
        <span>{execitionFee} Aleo</span>
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
  const [feeType, setFeeType] = useState<"public" | "private">("private");
  const { selectedWallet } = useAccount();
  const { tokens } = useToken();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);
  const { createTransaction, error, isProcessing, reset, txId } =
    useCreateTransaction({
      feePrivate: feeType === "private",
    });
  const [tokenSelected, setTokenSelected] = useState("");
  const [typeRecord, setTypeRecord] = useState<"credits" | "token">("credits");
  const [openTransfer, setOpenTransfer] = useState(false);

  const handleCreateTransaction = async () => {
    if (!selectedWallet) return;
    const { avatar, ...walletWithoutAvatar } = selectedWallet;

    const txHash = await createTransaction(
      walletWithoutAvatar,
      typeRecord === "credits" ? CREDITS_TOKEN_ID : tokenSelected,
      recipient,
      creditsToMicroCredits(amount)
    );

    if (txHash) {
      reset();
      setAmount(0);
      toast.success("Create transaction successfully");
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
        setFeeType("private");
        setRecipient("");
        setAmount(0);
        reset();
        setTokenSelected("");
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
            <div className="col-span-2 bg-white rounded-md relative w-full">
              {
                {
                  1: (
                    <Page1
                      typeRecord={typeRecord}
                      setTypeRecord={setTypeRecord}
                      tokens={tokens}
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
                      typeRecord={typeRecord}
                      selectedWallet={selectedWallet}
                      tokenSelected={tokenSelected}
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
                        console.log("TTT", tokenSelected);
                        if (step === 1 && (recipient === "" || amount === 0)) {
                          toast.error("Please fill out all the fields.");
                          return;
                        } else if (step === 1 && recipient && amount) {
                          if (amount < 0) {
                            toast.error("Amount must be greater than 0.");
                            return;
                          }
                          if (typeRecord === "token" && tokenSelected === "") {
                            toast.error("Please select a token.");
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
                          <Loader2 className="animate-spin" />
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

export default NewTransactionButton;
