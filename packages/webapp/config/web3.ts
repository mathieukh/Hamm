import { bsc, fantom, hardhat, polygon } from "@wagmi/chains";
import type { Chain } from "wagmi";
import { NODE_ENV } from "./env";

export const activeChain: Chain = NODE_ENV === "production" ? fantom : hardhat;

export const supportedChains: Chain[] =
	NODE_ENV === "production" ? [fantom, bsc, polygon] : [hardhat];
