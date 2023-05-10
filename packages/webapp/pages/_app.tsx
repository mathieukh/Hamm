import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { FC } from "react";
import type { AppProps } from "next/app";
import { wagmiConfig } from "@/lib/web3";
import { ToastContainer } from "react-toastify";
import { WagmiConfig } from "wagmi";

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <Component {...pageProps} />
      <ToastContainer
        autoClose={3000}
        position="bottom-center"
        theme="dark"
        draggable={false}
      />
    </WagmiConfig>
  );
};

export default App;
