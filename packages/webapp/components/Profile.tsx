import { FC } from "react";
import { AddressDropdown } from "./AddressDropdown";
import { ChooseChainDropdown } from "./ChooseChainDropdown";
import { useAccount, useConnect } from "wagmi";

export const Profile: FC = () => {
  const { isDisconnected } = useAccount();
  const { connect, connectors } = useConnect();
  if (isDisconnected)
    return (
      <button
        className="btn btn-outline btn-secondary"
        onClick={() => connect({ connector: connectors[0] })}
      >
        Connect wallet
      </button>
    );
  return (
    <div className="flex flex-row gap-2">
      <AddressDropdown />
      <ChooseChainDropdown />
    </div>
  );
};
