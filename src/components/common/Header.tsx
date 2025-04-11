import {
  ArrowUpDown,
  Bell,
  ChevronDown,
  ChevronUp,
  Home,
  KeyRound,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Link } from "react-router-dom";
import ZeroIcon from "./ZeroIcon";
import { WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import "@demox-labs/aleo-wallet-adapter-reactui/dist/styles.css";
import { Badge } from "../ui/badge";
import useAccount from "@/stores/useAccount";
import { formatAleoAddress } from "@/utils";
import { removeVisibleModifier } from "zerosecurehq-sdk";
import { useState } from "react";

const NAVIGATE_PAGES = [
  { name: "Home", icon: Home, href: "/" },
  { name: "Transactions", icon: ArrowUpDown, href: "/transactions" },
  { name: "Account", icon: User, href: "/connect" },
  { name: " Governance", icon: KeyRound, href: "/governance" },
];

const Header = () => {
  const { selectedWallet, publicKey, resetWallet } = useAccount();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b-gray-200 border-b flex items-center justify-between fixed top-0 left-0 w-full h-16 z-20">
      <div className="text-3xl font-bold p-4">
        <Link className="flex items-center" to={"/"}>
          {" "}
          <ZeroIcon width={30} height={30} />
          <span className="ml-2">
            Zero<span className="text-blue-500">Secure</span>
          </span>
        </Link>
      </div>
      <div className="flex flex-1 justify-center">
        {" "}
        {NAVIGATE_PAGES?.map((item) => (
          <Button
            key={item.name}
            asChild
            variant="ghost"
            className={`mx-1 ${
              ((!selectedWallet && item.name !== "Account") || !publicKey) &&
              "hidden"
            }`}
          >
            <Link to={item.href} className="flex items-center p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <item.icon size={20} />
                <div>{item.name}</div>
              </div>
            </Link>
          </Button>
        ))}
      </div>
      <div className="flex items-center h-full">
        <div className="h-full flex items-center justify-center border-r border-gray-200 p-5 cursor-pointer hover:bg-gray-200">
          <Bell />
        </div>
        {selectedWallet && (
          <div className="h-full flex items-center justify-center border-r border-gray-200 p-5 cursor-pointer gap-3 hover:bg-gray-200 relative">
            <div
              className={`w-12 h-12 relative ${selectedWallet?.avatar} rounded-xl`}
            />
            <div className="text-sm flex-1">
              <div className="font-semibold text-center">
                <Badge>Wallet 1</Badge>
              </div>
              <div className="text-sm mt-1 flex items-center justify-between gap-2">
                <span className="text-gray-600">multisig:</span>
                <span className="text-gray-900">
                  {formatAleoAddress(
                    removeVisibleModifier(selectedWallet.data.wallet_address)
                  )}
                </span>
              </div>
            </div>
            {open ? (
              <>
                <ChevronDown
                  size={20}
                  onClick={() => {
                    setOpen(false);
                  }}
                />
              </>
            ) : (
              <ChevronUp
                size={20}
                onClick={() => {
                  setOpen(true);
                }}
              />
            )}
            {open && (
              <Card className="absolute top-full right-0 mt-2 w-full">
                <CardHeader>
                  <CardTitle>Wallet</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button  variant={"outline"} className="w-full" onClick={() => {
                    setOpen(false);
                    resetWallet()
                  }}>Logout</Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <div className="mx-2">
          <WalletMultiButton
            // startIcon={<Wallet size={16} />}
            style={{
              backgroundColor: "transparent",
              color: "black",
              fontSize: ".9rem",
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
