import {
  hardhat,
  arbitrum,
  fantom,
  arbitrumGoerli,
  fantomTestnet,
} from "@wagmi/core/chains";
import { configureChains, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { infuraProvider } from "wagmi/providers/infura";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";

const { INFURA_PROVIDER_API_KEY } = process.env;

const MAIN_CHAINS = [arbitrum, fantom];
const TEST_CHAINS = [hardhat, arbitrumGoerli, fantomTestnet];

export const { chains, provider } = configureChains(
  [...MAIN_CHAINS, ...TEST_CHAINS],
  [
    infuraProvider({ apiKey: INFURA_PROVIDER_API_KEY!!, priority: 0 }),
    publicProvider({ priority: 1 }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Hamm",
  chains,
});

export const wagmiClient = createClient({
  autoConnect: true,
  provider,
  connectors,
});
