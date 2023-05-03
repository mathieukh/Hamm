import { FC } from "react";
import { ConnectWallet, useConnectionStatus } from "@thirdweb-dev/react";
import { AddressDropdown } from "./AddressDropdown";
import { ChooseChainDropdown } from "./ChooseChainDropdown";

export const Profile: FC = () => {
  const status = useConnectionStatus();
  if (status === "connecting" || status === "unknown") return null;
  if (status === "disconnected") return <ConnectWallet theme="light" />;
  return (
    <div className="flex flex-row gap-2">
      <AddressDropdown />
      <ChooseChainDropdown />
    </div>
  );
};
