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

import { useState } from "react";

const Page1 = () => {
  return (
    <div className="p-5 space-y-6 border-t border-b border-gray-200">
      <Warning
        msg={
          "Do not directly send aleo credits to multisig address because it is virtual and not exit in the blockchain."
        }
      />
      <div className="flex- space-y-1.5">
        <Label>Amount</Label>
        <Input type="number" placeholder="0" />
      </div>
    </div>
  );
};

const Page2 = ({
  feeType,
  setFeeType,
  depositType,
  setDepositType,
}: {
  feeType: "public" | "private";
  setFeeType: (type: "public" | "private") => void;
  depositType: "public" | "private";
  setDepositType: (type: "public" | "private") => void;
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
          <span className="font-semibold">12</span>
          <span className="text-xl font-mono">.44 Aleo</span>
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
        <span>aleo12a...ss2s</span>
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
  let [step, setStep] = useState(1);
  let [feeType, setFeeType] = useState<"public" | "private">("public");
  let [depositType, setDepositType] = useState<"public" | "private">("public");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          {text}
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
                  1: <Page1 />,
                  2: (
                    <Page2
                      depositType={depositType}
                      setDepositType={setDepositType}
                      feeType={feeType}
                      setFeeType={setFeeType}
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
                      onClick={() => setStep(step + 1)}
                      variant={"outline"}
                    >
                      Next
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

export default DepositButton;
