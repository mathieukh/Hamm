import "@rainbow-me/rainbowkit/styles.css";
import { activeChain, supportedChains } from "@/config";
import { theme } from "@/config/theme";
import { wagmiConfig } from "@/lib/web3";
import { ChakraProvider } from "@chakra-ui/react";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import type { FC } from "react";
import { WagmiConfig } from "wagmi";

const App: FC<AppProps> = ({ Component, pageProps }) => {
	return (
		<ChakraProvider theme={theme}>
			<WagmiConfig config={wagmiConfig}>
				<RainbowKitProvider chains={supportedChains} initialChain={activeChain}>
					<Component {...pageProps} />
				</RainbowKitProvider>
			</WagmiConfig>
		</ChakraProvider>
	);
};

export default App;
