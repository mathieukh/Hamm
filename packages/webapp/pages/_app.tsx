import "@rainbow-me/rainbowkit/styles.css";
import { FC } from "react";
import type { AppProps } from "next/app";
import { wagmiConfig } from "@/lib/web3";
import { WagmiConfig } from "wagmi";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@/config/theme";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { activeChain, supportedChains } from "@/config";

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
