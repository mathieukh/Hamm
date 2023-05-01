import { FC } from "react";
import { ConnectWallet, useAddress, useDisconnect } from "@thirdweb-dev/react";
import { truncateAddress } from "@/utils";

export const Profile: FC = () => {
  const address = useAddress();
  const disconnect = useDisconnect();
  if (address === undefined) return <ConnectWallet />;
  const displayedAddress = truncateAddress(address);
  return (
    <div className="flex gap-2">
      <span className={`font-semibold text-md`}>
        Connected to <span className="font-bold">{displayedAddress}</span>
      </span>
      <button title="Disconnect wallet" onClick={disconnect}>
        x
      </button>
    </div>
  );
};
