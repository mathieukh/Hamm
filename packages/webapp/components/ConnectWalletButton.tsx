import { Button, ButtonProps } from "@chakra-ui/react";
import { FC } from "react";
import { useAccount, useConnect } from "wagmi";

export const ConnectWalletButton: FC<ButtonProps> = (props) => {
  const { isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  return (
    <Button
      {...props}
      onClick={() => connect({ connector: connectors[0] })}
      isLoading={isConnecting}
    >
      {props.children ?? "Connect wallet"}
    </Button>
  );
};
