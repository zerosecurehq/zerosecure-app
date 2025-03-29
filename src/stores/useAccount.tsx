import { create } from "zustand";
import { WalletRecord } from "zerosecurehq-sdk";

interface AccountState {
  wallets: WalletRecord[];
  setWallets: (wallets: WalletRecord[]) => void;
  pinnedWallets: WalletRecord[];
  selectedWallet: WalletRecord | null;
  setSelectedWallet: (wallet: WalletRecord | null) => void;
  setPinnedWallet: (wallet: WalletRecord) => void;
  removePinnedWallet: (wallet: WalletRecord) => void;
}

const useAccount = create<AccountState>((set) => {
  return {
    wallets: [],
    pinnedWallets: JSON.parse(localStorage.getItem("pinnedWallets") || "[]"),

    setWallets: (wallets) => {
      set({ wallets });
    },

    selectedWallet: JSON.parse(localStorage.getItem("selectedWallet") || "null"),
    setSelectedWallet: (wallet) => {
      localStorage.setItem("selectedWallet", JSON.stringify(wallet));
      set({ selectedWallet: wallet });
    },

    setPinnedWallet: (wallet) => {
      set((state) => {
        if (
          state.pinnedWallets.some(
            (w) => w.data.wallet_address === wallet.data.wallet_address
          )
        ) {
          return state;
        }

        const updatedPinned = [...state.pinnedWallets, wallet];
        localStorage.setItem("pinnedWallets", JSON.stringify(updatedPinned));

        return { pinnedWallets: updatedPinned };
      });
    },

    removePinnedWallet: (wallet) => {
      set((state) => {
        const updatedPinned = state.pinnedWallets.filter(
          (w) => w.data.wallet_address !== wallet.data.wallet_address
        );

        localStorage.setItem("pinnedWallets", JSON.stringify(updatedPinned));

        return { pinnedWallets: updatedPinned };
      });
    },
  };
});

export default useAccount;
