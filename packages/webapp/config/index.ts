import {
  fantom,
  fantomTestnet,
  arbitrum,
  arbitrumGoerli,
  hardhat,
} from "@wagmi/chains";
import { Chain } from "wagmi";

const { INFURA_PROVIDER_API_KEY, NODE_ENV } = process.env;

const activeChain: Chain = NODE_ENV === "production" ? fantom : hardhat;

const supportedChains: Chain[] =
  NODE_ENV === "production"
    ? [fantom, arbitrum]
    : [hardhat, arbitrumGoerli, fantomTestnet];

export { INFURA_PROVIDER_API_KEY, activeChain, supportedChains };
