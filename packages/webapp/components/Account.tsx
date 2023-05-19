import { FC } from "react";
import { AddressDropdown } from "./AddressDropdown";
import { useAccount } from "wagmi";
import { ConnectWalletButton } from "./ConnectWalletButton";

export const Account: FC = () => {
  const { isConnected } = useAccount();
  if (!isConnected) return <ConnectWalletButton />;
  return <AddressDropdown />;
};
