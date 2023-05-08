import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { FC } from "react";
import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { thirdwebConfig } from "@/lib/web3";
import { ToastContainer } from "react-toastify";

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ThirdwebProvider {...thirdwebConfig}>
      <Component {...pageProps} />
      <ToastContainer
        autoClose={3000}
        position="bottom-center"
        theme="dark"
        draggable={false}
      />
    </ThirdwebProvider>
  );
};

export default App;
