import { useMemo } from "react";
import {
  PuzzleWalletAdapter,
  LeoWalletAdapter,
  FoxWalletAdapter,
  SoterWalletAdapter,
} from "aleo-adapters";
import {
  DecryptPermission,
  WalletAdapterNetwork,
} from "@demox-labs/aleo-wallet-adapter-base";
import { WalletProvider } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletModalProvider } from "@demox-labs/aleo-wallet-adapter-reactui";
import { Toaster } from "./components/ui/sonner";
import Routers from "./components/routes/Routers";
const App = () => {
  const wallets = useMemo(
    () => [
      new LeoWalletAdapter({
        appName: "Aleo app",
      }),
      new PuzzleWalletAdapter({
        programIdPermissions: {
          // [WalletAdapterNetwork.MainnetBeta]: [
          //   "aleo_multisig_v5.aleo",
          //   "credits.aleo",
          //   "dApp_1_test.aleo",
          //   "dApp_1_test_import.aleo",
          //   "dApp_1_test_import_2.aleo",
          // ],
          [WalletAdapterNetwork.TestnetBeta]: [
            "zerosecure_v2.aleo",
            "aleo_multisig_v5.aleo",
            "credits.aleo",
            "dApp_1_test.aleo",
            "dApp_1_test_import.aleo",
            "dApp_1_test_import_2.aleo",
          ],
        },
        appName: "Aleo app",
        appDescription: "A privacy-focused DeFi app",
        appIconUrl: "",
      }),
      new FoxWalletAdapter({
        appName: "Aleo app",
      }),
      new SoterWalletAdapter({
        appName: "Aleo app",
      }),
    ],
    []
  );

  return (
    <WalletProvider
      wallets={wallets}
      decryptPermission={DecryptPermission.OnChainHistory}
      network={WalletAdapterNetwork.TestnetBeta}
      programs={["zerosecure.aleo, credits.aleo, aleo_multisig_v5.aleo"]}
      autoConnect
    >
      <WalletModalProvider>
        <main className="min-h-screen">
          <Routers />
        </main>{" "}
        <Toaster />
      </WalletModalProvider>
    </WalletProvider>
  );
};

export default App;
