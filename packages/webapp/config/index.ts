import {
  Fantom,
  Localhost,
  Arbitrum,
  ArbitrumGoerli,
  FantomTestnet,
} from "@thirdweb-dev/chains";

const { INFURA_PROVIDER_API_KEY, NODE_ENV } = process.env;

const activeChain = NODE_ENV === "production" ? Fantom : Localhost;

const supportedChains =
  NODE_ENV === "production"
    ? [Fantom, Arbitrum]
    : [Localhost, ArbitrumGoerli, FantomTestnet];

export { INFURA_PROVIDER_API_KEY, activeChain, supportedChains };
