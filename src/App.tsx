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
import {
  useWallet,
  WalletProvider,
} from "@demox-labs/aleo-wallet-adapter-react";
import { WalletModalProvider } from "@demox-labs/aleo-wallet-adapter-reactui";
import { Toaster } from "./components/ui/sonner";
import Routers from "./routes/Routers";
import { ALL_PROGRAM_IDS, ZeroSecureProvider } from "zerosecurehq-sdk";
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

  // Few notes:
  // 1. The `WalletProvider` must be wrapped around the `ZeroSecureProvider` to ensure that the wallet context is available throughout the application.
  // 2. `AccountProvider` must be inside the `ZeroSecureProvider` to access the wallet context and manage account-related state.
  return (
    <main className="min-h-screen">
      <WalletProvider
        wallets={wallets}
        decryptPermission={DecryptPermission.OnChainHistory}
        network={WalletAdapterNetwork.TestnetBeta}
        autoConnect
      >
        <WalletModalProvider>
          <ZeroSecureProvider useWallet={useWallet as any}>
            <AccountProvider>
              <Routers />
              <Toaster />
            </AccountProvider>
          </ZeroSecureProvider>
        </WalletModalProvider>
      </WalletProvider>
    </main>
  );
};

export default App;
