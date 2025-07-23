import useAccount from "@/stores/useAccount";
import useToken, { TOKEN_LOCAL_KEY } from "@/stores/useToken";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useGetWalletCreated } from "zerosecurehq-sdk";

export default function AccountProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { publicKey } = useWallet();
  const { getWalletCreated, reset } = useGetWalletCreated();
  const {
    resetAccount,
    setWallets,
    loadFromLocal,
    selectedWallet,
    wallets,
    setSelectedWallet,
  } = useAccount();
  const { addTokens, walletAddressToGetToken } = useToken();

  // The local setlectedWallet may be outdated when owners change governance, so we need to check if
  // the wallet is still valid and update it if necessary.
  const fetchWalletsAndCheckOutdated = async () => {
    const newWallets = await getWalletCreated();
    if (newWallets) {
      console.log("Fetched wallets:", newWallets);
      setWallets(newWallets);
      reset();
    }
  };

  useEffect(() => {
    if (!publicKey) {
      resetAccount();
      return;
    }
    loadFromLocal(publicKey);
    fetchWalletsAndCheckOutdated();
  }, [publicKey]);

  useEffect(() => {
    if (walletAddressToGetToken) {
      const localTokenObject = JSON.parse(
        localStorage.getItem(TOKEN_LOCAL_KEY) || "{}"
      );
      if (Array.isArray(localTokenObject[walletAddressToGetToken])) {
        addTokens(localTokenObject[walletAddressToGetToken]);
      }
    }
  }, [walletAddressToGetToken]);

  useEffect(() => {
    if (!selectedWallet || !wallets) return;

    for (const wallet of wallets) {
      if (wallet.data.wallet_address === selectedWallet?.data.wallet_address) {
        if (
          parseInt(wallet.data.sequence) >
          parseInt(selectedWallet.data.sequence)
        ) {
          setSelectedWallet(wallet);
          toast.info(
            "We detected a change in your wallet's governance. New wallet has been selected."
          );
        }
      }
    }
  }, [selectedWallet, wallets]);

  return <>{children}</>;
}
