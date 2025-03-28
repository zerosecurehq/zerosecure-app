import DepositButton from "@/components/dashboard/wallet/DepositButton";
import NewTransactionButton from "@/components/dashboard/wallet/NewTransactionButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Warning from "@/components/ui/Warning";
import { Wallet } from "lucide-react";

const Home = () => {
  return (
    <section className="w-full overflow-auto px-28">
      <div className="p-4">
        <Warning
          msg={
            "Do not directly send aleo credits to multisig address because it is virtual and not exit in the blockchain."
          }
        />
      </div>
      <div className="grid grid-cols-3 gap-3 p-4">
        <Card className="p-6 col-span-2">
          <CardContent className="flex items-center justify-between p-0">
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <div className="flex items-center gap-2 mt-1 text-2xl font-bold">
                <Wallet className="w-6 h-6" />
                <span>$3,102.48</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DepositButton />
              <NewTransactionButton
                text="Transfer"
                className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="p-6 col-span-1">
          <CardContent className="flex items-center justify-between p-0">
            <div>
              <p className="text-sm text-muted-foreground">
                Current Balance In Aleo
              </p>
              <div className="flex items-center gap-2 mt-1 text-2xl font-bold">
                <img
                  style={{
                    borderRadius: "50%",
                  }}
                  src="./aleo.svg"
                  width={25}
                  height={25}
                />
                <span>123.21 Aleo</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Home;
