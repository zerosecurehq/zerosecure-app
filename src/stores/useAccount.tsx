import { create } from "zustand";
import { WalletRecord } from "zerosecurehq-sdk";

export interface WalletRecordData extends WalletRecord {
  avatar?: string;
}

interface AccountState {
  wallets: WalletRecordData[];
  pinnedWallets: WalletRecordData[];
  selectedWallet: WalletRecordData | null;
  setWallets: (wallets: WalletRecordData[]) => void;
  togglePinnedWallet: (wallet: WalletRecordData) => void;
  setSelectedWallet: (wallet: WalletRecordData | null) => void;
  resetAccount: () => void;
}

const gradients = [
  "bg-gradient-to-r from-blue-500 to-green-500",
  "bg-gradient-to-r from-purple-500 to-pink-500",
  "bg-gradient-to-r from-red-500 to-yellow-500",
  "bg-gradient-to-r from-indigo-500 to-purple-500",
  "bg-gradient-to-r from-teal-500 to-cyan-500",
];

export const getRandomGradient = () =>
  gradients[Math.floor(Math.random() * gradients.length)];

const getLocalStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? defaultValue;
  } catch {
    return defaultValue;
  }
};

const setLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const enhanceWallets = (wallets: WalletRecordData[]) =>
  wallets.map((wallet) => ({
    ...wallet,
    avatar: wallet.avatar || getRandomGradient(),
  }));

const useAccount = create<AccountState>((set) => ({
  wallets: getLocalStorage("wallets", []),
  pinnedWallets: getLocalStorage("pinnedWallets", []),
  selectedWallet: getLocalStorage("selectedWallet", null),

  setWallets: (wallets) => {
    const enhanced = enhanceWallets(wallets);
    setLocalStorage("wallets", enhanced);
    set({ wallets: enhanced });
  },

  setSelectedWallet: (wallet) => {
    if (wallet) wallet.avatar = wallet.avatar || getRandomGradient();
    setLocalStorage("selectedWallet", wallet);
    set({ selectedWallet: wallet });
  },

  togglePinnedWallet: (wallet) => {
    set((state) => {
      const exists = state.pinnedWallets.some(
        (w) => w.data.wallet_address === wallet.data.wallet_address
      );
      const updatedPinned = exists
        ? state.pinnedWallets.filter(
            (w) => w.data.wallet_address !== wallet.data.wallet_address
          )
        : [...state.pinnedWallets, wallet];
      setLocalStorage("pinnedWallets", updatedPinned);
      return { pinnedWallets: updatedPinned };
    });
  },

  resetAccount: () => set({ wallets: [], pinnedWallets: [], selectedWallet: null }),
}));

export default useAccount;
