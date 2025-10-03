export * from "./storage";
import { WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import {
  encryptExecuteTransaction,
  ExecuteTicketRecord,
  getMultisigWalletBalance,
  removeVisibleModifier,
  TransferHistoryRecord,
  WalletRecord,
  ZEROSECURE_BACKEND_URL,
} from "zerosecurehq-sdk";
import { TokenRecord } from "zerosecurehq-sdk/dist/useGetTokenRecord";

export const network = WalletAdapterNetwork.TestnetBeta;

export const ZERO_ADDRESS =
  "aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc";

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

export const fakeTokens: TokenRecord[] = [
  {
    id: "rec1",
    spent: false,
    recordName: "record_one",
    name: "Token A",
    owner: "aleo1abcd1234567890",
    program_id: "program_001",
    data: {
      amount: "1000",
      token_id: "token_001",
      external_authorization_required: "false",
      authorized_until: "2025-12-31T23:59:59Z",
    },
  },
  {
    id: "rec2",
    spent: false,
    recordName: "record_two",
    name: "Token B",
    owner: "aleo1efgh1234567890",
    program_id: "program_002",
    data: {
      amount: "2500",
      token_id: "token_002",
      external_authorization_required: "true",
      authorized_until: "2026-06-30T23:59:59Z",
    },
  },
  {
    id: "rec3",
    spent: true,
    recordName: "record_three",
    name: "Token C",
    owner: "aleo1ijkl1234567890",
    program_id: "program_003",
    status: "expired",
    data: {
      amount: "500",
      token_id: "token_003",
      external_authorization_required: "false",
      authorized_until: "2024-12-01T00:00:00Z",
    },
  },
];

export const getRandomGradient = () =>
  gradients[Math.floor(Math.random() * gradients.length)];

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
): string[] => {
  const newSet = new Set(newOwners);
  const oldSet = new Set(oldOwners);

  const addedOwners = [...newSet]
    .filter((addr) => !oldSet.has(addr))
    .map((addr) => removeVisibleModifier(addr));
  return addedOwners;
};

export const getRemovedOwners = (
  newOwners: string[],
  oldOwners: string[]
): string[] => {
  const newSet = new Set(newOwners);
  const oldSet = new Set(oldOwners);

  const removedOwners = [...oldSet]
    .filter((addr) => !newSet.has(addr))
    .map((addr) => removeVisibleModifier(addr));
  return removedOwners;
};

export async function saveTransferToDB(
  record: TransferHistoryRecord,
  walletRecord: WalletRecord,
  publicKey: string,
  isInitiator: boolean = false,
  network: WalletAdapterNetwork = WalletAdapterNetwork.TestnetBeta
) {
  try {
    let encryptedData: string | undefined;

    if (isInitiator) {
      encryptedData = encryptExecuteTransaction(walletRecord, {
        data: {
          to: record.to,
          amount: record.amount,
          wallet_address: walletRecord.data.wallet_address,
          transfer_id: record.transferId,
        },
      } as ExecuteTicketRecord);
    }

    if (!encryptedData) {
      throw new Error("Encryption failed: empty encryptedData");
    }

    const response = await fetch(
      `${ZEROSECURE_BACKEND_URL}/${network}/transactions/saveTransfer`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...record,
          encryptedData,
          publicKey,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Backend error ${response.status}: ${errText}`);
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(`Failed to save transfer: ${error.message}`);
  }
}
