import "@/styles/globals.css";
import React, { FC } from "react";
import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { thirdwebConfig } from "@/lib/web3";

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ThirdwebProvider {...thirdwebConfig}>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
};

export default App;
