import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FC } from "react";
import { useAccount, useEnsName } from "wagmi";

export const Profile: FC = () => {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  if (isConnected) return <div>Connected to {ensName ?? address}</div>;
  return <ConnectButton />;
};
