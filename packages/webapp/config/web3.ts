import { Chain } from "wagmi";
import { fantom, hardhat, bsc, polygon } from "@wagmi/chains";
import { NODE_ENV } from "./env";

export const activeChain: Chain = NODE_ENV === "production" ? fantom : hardhat;

export const supportedChains: Chain[] =
  NODE_ENV === "production" ? [fantom, bsc, polygon] : [hardhat];
