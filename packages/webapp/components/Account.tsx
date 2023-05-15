import { FC } from "react";
import { AddressDropdown } from "./AddressDropdown";
import { useAccount, useConnect } from "wagmi";
import { Button } from "@chakra-ui/react";

export const Account: FC = () => {
  const { isConnecting, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  if (!isConnected)
    return (
      <Button
        onClick={() => connect({ connector: connectors[0] })}
        isLoading={isConnecting}
      >
        Connect wallet
      </Button>
    );
  return <AddressDropdown />;
};
