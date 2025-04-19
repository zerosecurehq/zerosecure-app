export * from "./storage";
import { WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import {
  getMultisigWalletBalance,
  removeVisibleModifier,
} from "zerosecurehq-sdk";

export const network = WalletAdapterNetwork.TestnetBeta;

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

export function convertAddressToZeroSecureAddress(address: string): string {
  return address.replace(/aleo1/g, "zero1");
}

export function formatField(field: string, partLength: number = 4): string {
  let newField = field.replace(/field/g, "");
  if (newField.length <= partLength * 2) return newField;
  let firstPart = newField.slice(0, partLength);
  let lastPart = newField.slice(-partLength);
  return `${firstPart}...${lastPart}field`;
}

export function creditsToMicroCredits(credits: number): number {
  return credits * 1_000_000;
}

export function microCreditsToCredits(microCredits: number): number {
  return microCredits / 1_000_000;
}

export const getBalanceMultiWallet = async (
  network: WalletAdapterNetwork,
  multisigWalletAddress: string,
  tokenId?: string
) => {
  const result = await getMultisigWalletBalance(
    network,
    removeVisibleModifier(multisigWalletAddress),
    tokenId
  );
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
