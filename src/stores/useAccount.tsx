import { create } from "zustand";
import { WalletRecord } from "zerosecurehq-sdk";

export interface WalletRecordData extends WalletRecord {
  avatar?: string;
}

interface AccountState {
  publicKey: string | null;
  setPublicKey: (key: string) => void;
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

const getStoredAccount = (publicKey: string) => {
  const accounts = getLocalStorage<Record<string, any>>("accounts", {});
  return (
    accounts[publicKey] || {
      wallets: [],
      pinnedWallets: [],
      selectedWallet: null,
    }
  );
};

const updateStoredAccount = (
  publicKey: string,
  data: Partial<AccountState>
) => {
  const accounts = getLocalStorage<Record<string, any>>("accounts", {});
  accounts[publicKey] = { ...accounts[publicKey], ...data };
  setLocalStorage("accounts", accounts);
};

const enhanceWallets = (wallets: WalletRecordData[], publicKey: string) => {
  const walletsOld =
    getLocalStorage<Record<string, any>>("accounts", {})[publicKey]?.wallets ||
    [];
  const newWallets = wallets.map((wallet) => {
    const oldWallet = walletsOld.find(
      (w: WalletRecordData) => w.id === wallet.id
    );
    if (oldWallet) return oldWallet;
    return { ...wallet, avatar: wallet.avatar || getRandomGradient() };
  });
  return newWallets;
};

const useAccount = create<AccountState>((set) => ({
  publicKey: null,
  wallets: [],
  pinnedWallets: [],
  selectedWallet: null,

  setPublicKey: (key) => {
    const accountData = getStoredAccount(key);
    set({ publicKey: key, ...accountData });
  },

  setWallets: (wallets) => {
    set((state) => {
      if (!state.publicKey) return {};
      const enhanced = enhanceWallets(wallets, state.publicKey);
      updateStoredAccount(state.publicKey, { wallets: enhanced });
      return { wallets: enhanced };
    });
  },

  setSelectedWallet: (wallet) => {
    set((state) => {
      if (!state.publicKey) return {};
      if (wallet) wallet.avatar = wallet.avatar || getRandomGradient();
      updateStoredAccount(state.publicKey, { selectedWallet: wallet });
      return { selectedWallet: wallet };
    });
  },

  togglePinnedWallet: (wallet) => {
    set((state) => {
      if (!state.publicKey) return {};
      const exists = state.pinnedWallets.some(
        (w) => w.data.wallet_address === wallet.data.wallet_address
      );
      const updatedPinned = exists
        ? state.pinnedWallets.filter(
            (w) => w.data.wallet_address !== wallet.data.wallet_address
          )
        : [...state.pinnedWallets, wallet];
      updateStoredAccount(state.publicKey, { pinnedWallets: updatedPinned });
      return { pinnedWallets: updatedPinned };
    });
  },

  resetAccount: () =>
    set({
      wallets: [],
      pinnedWallets: [],
      selectedWallet: null,
    }),
}));

export default useAccount;
