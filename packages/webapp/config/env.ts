import { Address } from "wagmi";

export const CONTRACT_ADDRESSES = {
  // BSC
  56: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_56,
  // Polygon
  137: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_137,
  // Fantom
  250: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_250,
  // Hardhat
  31337: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_31337,
} as Record<number, Address>;

export const INFURA_PROVIDER_API_KEY = process.env.INFURA_PROVIDER_API_KEY;
export const NODE_ENV = process.env.NODE_ENV;
export const WALLET_CONNECT_PROJECT_ID = process.env.WALLET_CONNECT_PROJECT_ID;
