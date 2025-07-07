import { TokenMetadata } from "zerosecurehq-sdk";
import { create } from "zustand";

interface TokenStore {
  tokens: TokenMetadata[];
  walletAddressToGetToken: string | null;
  setWalletAddressToGetToken: (walletAddress: string) => void;
  addTokens: (tokens: TokenMetadata[]) => void;
  removeToken: (tokenId: string) => void;
}

interface LocalTokenObject {
  [key: string]: TokenMetadata[];
}

export const TOKEN_LOCAL_KEY = "tokens";

const useToken = create<TokenStore>((set) => ({
  tokens: [],
  walletAddressToGetToken: null,

  addTokens: (newTokens: TokenMetadata[]) => {
    set((state) => {
      if (!state.walletAddressToGetToken) return state;

      const localTokenObject: LocalTokenObject = JSON.parse(
        localStorage.getItem(TOKEN_LOCAL_KEY) || "{}"
      );
      const currentTokens =
        localTokenObject[state.walletAddressToGetToken] || [];

      const existingIds = new Set(
        currentTokens.map((token: TokenMetadata) => token.token_id)
      );

      const mergedTokens = [
        ...currentTokens,
        ...newTokens.filter((token) => !existingIds.has(token.token_id)),
      ];

      localTokenObject[state.walletAddressToGetToken] = mergedTokens;
      localStorage.setItem(TOKEN_LOCAL_KEY, JSON.stringify(localTokenObject));

      return { tokens: mergedTokens };
    });
  },

  removeToken: (tokenId: string) => {
    set((state) => {
      if (!state.walletAddressToGetToken) return state;

      const localTokenObject: LocalTokenObject = JSON.parse(
        localStorage.getItem(TOKEN_LOCAL_KEY) || "{}"
      );
      const currentTokens =
        localTokenObject[state.walletAddressToGetToken] || [];

      const filteredTokens = currentTokens.filter(
        (token: TokenMetadata) => token.token_id !== tokenId
      );

      localTokenObject[state.walletAddressToGetToken] = filteredTokens;
      localStorage.setItem(TOKEN_LOCAL_KEY, JSON.stringify(localTokenObject));

      return { tokens: filteredTokens };
    });
  },

  setWalletAddressToGetToken: (walletAddressToGetToken: string) => {
    set({
      walletAddressToGetToken: walletAddressToGetToken,
    });
  },
}));

export default useToken;
