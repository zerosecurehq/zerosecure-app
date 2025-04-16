import { create } from "zustand";
import { removeVisibleModifier, WalletRecord } from "zerosecurehq-sdk";
import {
  getOrCreateWalletAvatar,
  getStoredAccountFromLocal,
  updateStoredAccountIntoLocal,
} from "@/utils/account";

export interface ExtendedWalletRecord extends WalletRecord {
  avatar?: string;
}

export interface AccountState {
  publicKey: string | null;
  setPublicKey: (key: string) => void;
  wallets: ExtendedWalletRecord[];
  pinnedWallets: ExtendedWalletRecord[];
  selectedWallet: ExtendedWalletRecord | null;
  setWallets: (wallets: ExtendedWalletRecord[]) => void;
  togglePinnedWallet: (wallet: ExtendedWalletRecord) => void;
  setSelectedWallet: (wallet: ExtendedWalletRecord | null) => void;
  resetAccount: () => void;
  resetWallet: () => void;
}

const useAccount = create<AccountState>((set) => ({
  publicKey: null,
  wallets: [],
  pinnedWallets: [],
  selectedWallet: null,

  setPublicKey: (key) => {
    const accountData = getStoredAccountFromLocal(key);
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
      updateStoredAccountIntoLocal(state.publicKey, { selectedWallet: wallet });
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
      updateStoredAccountIntoLocal(state.publicKey, {
        pinnedWallets: updatedPinned,
      });
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
}));

export default useAccount;
