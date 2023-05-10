import { INFURA_PROVIDER_API_KEY, supportedChains } from "@/config";
import { configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { infuraProvider } from "wagmi/providers/infura";
import { InjectedConnector } from "wagmi/connectors/injected";

const { chains, publicClient } = configureChains(supportedChains, [
  publicProvider(),
  ...(INFURA_PROVIDER_API_KEY
    ? [infuraProvider({ apiKey: INFURA_PROVIDER_API_KEY })]
    : []),
]);

export const wagmiConfig = createConfig({
  autoConnect: false,
  connectors: [new InjectedConnector({ chains })],
  publicClient,
});
