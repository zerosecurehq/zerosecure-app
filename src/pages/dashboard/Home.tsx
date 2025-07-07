import DepositButton from "@/components/dashboard/wallet/DepositButton";
import NewTransactionButton from "@/components/dashboard/wallet/NewTransactionButton";
import { Card, CardContent } from "@/components/ui/card";
import useAccount from "@/stores/useAccount";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import { getBalanceMultiWallet, microCreditsToCredits } from "@/utils";

const Home = () => {
  const { selectedWallet, publicKey } = useAccount();
  const [balanceMultiWallet, setBalanceMultiWallet] = useState(0);

  useEffect(() => {
    if (!publicKey) return;
    const getBalance = async () => {
      const result = await getBalanceMultiWallet(
        WalletAdapterNetwork.TestnetBeta,
        selectedWallet!.data.wallet_address
      );
      setBalanceMultiWallet(result);
    };
    if (selectedWallet) {
      getBalance();
    }
  }, [selectedWallet]);

  return (
    <section className="w-full overflow-auto px-28">
      <div className="p-4"></div>
      <div className="grid grid-cols-3 gap-3 p-4">
        <Card className="p-6 col-span-2">
          <CardContent className="flex items-center justify-between p-0">
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <div className="flex items-center gap-2 mt-1 text-2xl font-bold">
                <Wallet className="w-6 h-6" />
                <span>${0}</span>
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
                <span>{microCreditsToCredits(balanceMultiWallet)} Aleo</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Home;
