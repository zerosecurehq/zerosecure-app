import { removeVisibleModifier } from "zerosecurehq-sdk";
import { getLocalStorage, setLocalStorage } from "./storage";
import { getRandomGradient } from ".";
import { AccountState } from "@/stores/useAccount";

const WALLET_AVATAR_KEY = "wallet_avatars";

export const getWalletAvatarsFromLocal = (): Record<string, string> => {
  return getLocalStorage<Record<string, string>>(WALLET_AVATAR_KEY, {});
};

export const getOrCreateWalletAvatar = (walletAddress: string): string => {
  const convertedAddress = removeVisibleModifier(walletAddress);
  const avatars = getWalletAvatarsFromLocal();
  if (!avatars[convertedAddress]) {
    avatars[convertedAddress] = getRandomGradient();
    setLocalStorage(WALLET_AVATAR_KEY, avatars);
  }
  return avatars[convertedAddress];
};

export const getStoredAccountFromLocal = (publicKey: string) => {
  const accounts = getLocalStorage<Record<string, any>>("accounts", {});
  return (
    accounts[publicKey] || {
      pinnedWallets: [],
      selectedWallet: null,
    }
  );
};

export const updateStoredAccountIntoLocal = (
  publicKey: string,
  data: Partial<AccountState>
) => {
  const accounts = getLocalStorage<Record<string, any>>("accounts", {});
  accounts[publicKey] = { ...accounts[publicKey], ...data };
  setLocalStorage("accounts", accounts);
};
