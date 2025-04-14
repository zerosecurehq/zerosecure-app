import { create } from "zustand";
import {
  removeVisibleModifier,
  TokenMetadata,
  WalletRecord,
} from "zerosecurehq-sdk";

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
  resetWallet: () => void;
  tokens: TokenMetadata[];
  setTokens: (tokens: TokenMetadata[]) => void;
}

const gradients = [
  "bg-gradient-to-r from-pink-500 to-yellow-500",
  "bg-gradient-to-r from-purple-500 to-indigo-500",
  "bg-gradient-to-r from-blue-500 to-teal-400",
  "bg-gradient-to-r from-green-400 to-blue-500",
  "bg-gradient-to-r from-red-400 to-pink-400",
  "bg-gradient-to-r from-yellow-400 to-red-500",
  "bg-gradient-to-r from-cyan-400 to-blue-600",
  "bg-gradient-to-r from-emerald-400 to-lime-500",
  "bg-gradient-to-r from-indigo-500 to-purple-600",
  "bg-gradient-to-r from-rose-400 to-fuchsia-500",
  "bg-gradient-to-r from-orange-400 to-amber-500",
  "bg-gradient-to-r from-teal-400 to-cyan-500",
  "bg-gradient-to-r from-blue-400 to-violet-500",
  "bg-gradient-to-r from-lime-400 to-green-500",
  "bg-gradient-to-r from-fuchsia-400 to-rose-500",
  "bg-gradient-to-r from-amber-400 to-yellow-500",
  "bg-gradient-to-r from-sky-400 to-blue-500",
  "bg-gradient-to-r from-purple-400 to-pink-500",
  "bg-gradient-to-r from-green-500 to-teal-500",
  "bg-gradient-to-r from-pink-400 to-red-500",
  "bg-gradient-to-r from-indigo-400 to-blue-500",
  "bg-gradient-to-r from-teal-300 to-green-400",
  "bg-gradient-to-r from-yellow-300 to-orange-400",
  "bg-gradient-to-r from-blue-300 to-indigo-400",
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

const WALLET_AVATAR_KEY = "wallet_avatars";

const getWalletAvatars = (): Record<string, string> => {
  return getLocalStorage<Record<string, string>>(WALLET_AVATAR_KEY, {});
};

const getOrCreateWalletAvatar = (walletAddress: string): string => {
  const convertedAddress = removeVisibleModifier(walletAddress);
  const avatars = getWalletAvatars();
  if (!avatars[convertedAddress]) {
    avatars[convertedAddress] = getRandomGradient();
    setLocalStorage(WALLET_AVATAR_KEY, avatars);
  }
  return avatars[convertedAddress];
};

const getStoredAccount = (publicKey: string) => {
  const accounts = getLocalStorage<Record<string, any>>("accounts", {});
  return (
    accounts[publicKey] || {
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

const useAccount = create<AccountState>((set) => ({
  publicKey: null,
  wallets: [],
  pinnedWallets: [],
  selectedWallet: null,
  tokens: [],

  setPublicKey: (key) => {
    const accountData = getStoredAccount(key);
    set({ publicKey: key, ...accountData });
  },

  setWallets: (wallets) => {
    set((state) => {
      if (!state.publicKey) return state;
      const enhanced = wallets.map((wallet) => ({
        ...wallet,
        avatar: getOrCreateWalletAvatar(
          removeVisibleModifier(wallet.data.wallet_address)
        ),
      }));
      return { wallets: enhanced };
    });
  },

  setSelectedWallet: (wallet) => {
    set((state) => {
      if (!state.publicKey) return {};
      if (wallet) {
        wallet.avatar = getOrCreateWalletAvatar(wallet.data.wallet_address);
      }
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
      publicKey: null,
      wallets: [],
      pinnedWallets: [],
      selectedWallet: null,
    }),
  resetWallet: () => set({ selectedWallet: null }),

  setTokens: (newTokens: TokenMetadata[]) => {
    set((state) => {
      if (!state.publicKey) return state;
      const tokenOld = JSON.parse(localStorage.getItem("token") || "{}");
      const existingIds = new Set(state.tokens.map((token) => token.token_id));
      const uniqueNewTokens = newTokens.filter(
        (token) => !existingIds.has(token.token_id)
      );
      tokenOld[state.publicKey] = [...state.tokens, ...uniqueNewTokens];
      localStorage.setItem("token", JSON.stringify(tokenOld));
      return { tokens: [...state.tokens, ...uniqueNewTokens] };
    });
  },
}));

export default useAccount;
