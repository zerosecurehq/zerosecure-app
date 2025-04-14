import { Route, Routes } from "react-router-dom";
import Home from "./pages/dashboard/Home";
import Connect from "./pages/connect/Connect";
import Dashboard from "./pages/dashboard/Dashboard";
import Transactions from "./pages/dashboard/Transactions";
import AddressBook from "./pages/dashboard/AddressBook";
import Apps from "./pages/dashboard/Apps";
import Settings from "./pages/dashboard/Settings";
import WhatNew from "./pages/dashboard/WhatNew";
import NeedHelp from "./pages/dashboard/NeedHelp";
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
import Governance from "./pages/dashboard/Governance";
import Token from "./pages/dashboard/Token";

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
          <Routes>
            <Route path="/connect" element={<Connect />} />
            <Route path="/*" element={<Dashboard />}>
              <Route index element={<Home />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="address-book" element={<AddressBook />} />
              <Route path="app" element={<Apps />} />
              <Route path="settings" element={<Settings />} />
              <Route path="what-new" element={<WhatNew />} />
              <Route path="need-help" element={<NeedHelp />} />
              <Route path="connect" element={<Connect />} />
              <Route path="governance" element={<Governance />} />
              <Route path="token" element={<Token />} />
            </Route>
          </Routes>
        </main>{" "}
        <Toaster />
      </WalletModalProvider>
    </WalletProvider>
  );
};

export default App;
