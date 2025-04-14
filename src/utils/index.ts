import { WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import { getMultisigWalletBalance } from "zerosecurehq-sdk";

export const network = WalletAdapterNetwork.TestnetBeta;

export function convertKey(input: string): string {
  if (input.length <= 8) return input;

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
  return isNaN(result) ? 0 : result;
};

export const isArrayChangedById = (
  oldArray: { id: string }[],
  newArray: { id: string }[]
) => {
  const oldIds = oldArray.map((item) => item.id).sort();
  const newIds = newArray.map((item) => item.id).sort();

  if (oldIds.length !== newIds.length) return true;

  for (let i = 0; i < oldIds.length; i++) {
    if (oldIds[i] !== newIds[i]) return true;
  }

  return false;
};

export const getAddedOwners = (
  newOwners: string[],
  oldOwners: string[]
): number => {
  const newSet = new Set(newOwners);
  const oldSet = new Set(oldOwners);

  return [...newSet].filter((addr) => !oldSet.has(addr)).length;
};

export const getRemovedOwners = (
  newOwners: string[],
  oldOwners: string[]
): number => {
  const newSet = new Set(newOwners);
  const oldSet = new Set(oldOwners);

  return [...oldSet].filter((addr) => !newSet.has(addr)).length;
};

export const enoughComfirm = (confirmed: string, request: string): boolean => {
  return parseInt(confirmed) >= parseInt(request);
};
