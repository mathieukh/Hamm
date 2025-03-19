import {
	INFURA_PROVIDER_API_KEY,
	WALLET_CONNECT_PROJECT_ID,
	supportedChains,
} from "@/config";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient, webSocketPublicClient } = configureChains(
	supportedChains,
	[
		publicProvider(),
		...(INFURA_PROVIDER_API_KEY
			? [infuraProvider({ apiKey: INFURA_PROVIDER_API_KEY })]
			: []),
	],
);

const { connectors } = getDefaultWallets({
	appName: "Hamm",
	projectId: WALLET_CONNECT_PROJECT_ID,
	chains,
});

export const wagmiConfig = createConfig({
	autoConnect: false,
	connectors,
	publicClient,
	webSocketPublicClient,
});
