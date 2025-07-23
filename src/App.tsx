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
import Routers from "./routes/Routers";
import { ALL_PROGRAM_IDS } from "zerosecurehq-sdk";
import AccountProvider from "./providers/AccountProvider";
const App = () => {
  const wallets = useMemo(
    () => [
      new LeoWalletAdapter({
        appName: "ZeroSecure",
      }),
      new PuzzleWalletAdapter({
        programIdPermissions: {
          [WalletAdapterNetwork.MainnetBeta]: [...ALL_PROGRAM_IDS],
          [WalletAdapterNetwork.TestnetBeta]: [...ALL_PROGRAM_IDS],
        },
        appName: "ZeroSecure",
        appDescription: "Securing the future of digital assets.",
        appIconUrl: "",
      }),
      new FoxWalletAdapter({
        appName: "ZeroSecure",
      }),
      new SoterWalletAdapter({
        appName: "ZeroSecure",
      }),
    ],
    []
  );

  return (
    <WalletProvider
      wallets={wallets}
      decryptPermission={DecryptPermission.OnChainHistory}
      network={WalletAdapterNetwork.TestnetBeta}
      autoConnect
    >
      <WalletModalProvider>
        <AccountProvider>
          <main className="min-h-screen">
            <Routers />
          </main>
          <Toaster />
        </AccountProvider>
      </WalletModalProvider>
    </WalletProvider>
  );
};

export default App;
