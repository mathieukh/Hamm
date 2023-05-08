import { usePiggyBanksIds } from "../hooks";
import { FC } from "react";
import { CreatePiggyBankButton } from "./CreatePiggyBankButton";
import { useAddress } from "@thirdweb-dev/react";

export const PiggyBanksCounter: FC<{ address: string }> = ({ address }) => {
  const { data: piggyBanksIds, status } = usePiggyBanksIds(address);
  const isConnectedAddress = useAddress() === address;
  if (status === "error")
    return (
      <span className="text-xl font-bold text-red-600 rounded-sm p-2 bg-red-300/40">
        Fail to fetch piggy banks ids
      </span>
    );
  return (
    <div className="stats">
      <div className="stat">
        <div className="stat-value text-secondary">
          {status === "loading" ? (
            <progress className="progress progress-secondary w-10"></progress>
          ) : (
            piggyBanksIds.length
          )}
        </div>
        <div className="stat-title">Piggy banks</div>
        {isConnectedAddress && (
          <div className="stat-actions">
            <CreatePiggyBankButton />
          </div>
        )}
      </div>
    </div>
  );
};
