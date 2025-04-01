import { WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import { getMultisigWalletBalance } from "zerosecurehq-sdk";

export function convertKey(input: string): string {
  if (input.length <= 8) return input; // Nếu chuỗi quá ngắn, không cần xử lý

  const firstPart = input.slice(0, 4);
  const lastPart = input.slice(-4);

  return `${firstPart}...${lastPart}`;
}

export function formatAleoAddress(address: string): string {
  const firstPart = address.slice(0, 8);
  const lastPart = address.slice(-5);

  return `${firstPart}...${lastPart}`;
}

export function creditsToMicroCredits(credits: number): number {
  return credits * 1_000_000;
}

export function microCreditsToCredits(microCredits: number): number {
  return microCredits / 1_000_000;
}

export const getBalanceMultiWallet = async (
  network: WalletAdapterNetwork,
  multisigWalletAddress: string
) => {
  const result = await getMultisigWalletBalance(network, multisigWalletAddress);
  return result;
};
