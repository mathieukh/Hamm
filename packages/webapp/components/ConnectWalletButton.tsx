import { Button, ButtonProps } from "@chakra-ui/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { FC } from "react";
import { useAccount } from "wagmi";

export const ConnectWalletButton: FC<ButtonProps> = (props) => {
  const { isConnecting } = useAccount();
  const { openConnectModal } = useConnectModal();
  return (
    <Button
      {...props}
      onClick={() => openConnectModal?.()}
      isLoading={isConnecting}
    >
      {props.children ?? "Connect wallet"}
    </Button>
  );
};
