import { FC } from "react";
import type { AppProps } from "next/app";
import { wagmiConfig } from "@/lib/web3";
import { WagmiConfig } from "wagmi";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@/config/theme";

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <WagmiConfig config={wagmiConfig}>
        <Component {...pageProps} />
      </WagmiConfig>
    </ChakraProvider>
  );
};

export default App;
