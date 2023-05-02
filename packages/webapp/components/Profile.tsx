import { FC } from "react";
import { ConnectWallet, useConnectionStatus } from "@thirdweb-dev/react";
import { AddressDropdown } from "./AddressDropdown";

export const Profile: FC = () => {
  const status = useConnectionStatus();
  if (status === "connecting" || status === "unknown") return null;
  if (status === "disconnected") return <ConnectWallet />;
  return <AddressDropdown />;
};
