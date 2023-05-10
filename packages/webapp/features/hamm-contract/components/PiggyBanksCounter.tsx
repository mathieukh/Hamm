import { FC } from "react";
import { CreatePiggyBankButton } from "./CreatePiggyBankButton";
import { Address, useAccount } from "wagmi";
import { useHammGetPiggyBankIdsForAddress } from "@/lib/hamm";
import { useContractAddress } from "../hooks";

export const PiggyBanksCounter: FC<{ address: Address }> = ({ address }) => {
  const contractAddress = useContractAddress();
  const { data: piggyBanksIds, status } = useHammGetPiggyBankIdsForAddress({
    address: contractAddress,
    args: [address],
  });
  const { address: connectedAddress } = useAccount();
  const isConnectedAddressPage = connectedAddress == address;
  if (status === "error")
    return (
      <span className="text-xl font-bold text-red-600 rounded-sm p-2 bg-red-300/40">
        Fail to fetch piggy banks ids
      </span>
    );
  return (
    <div className="stats bg-neutral">
      <div className="stat">
        <div className="stat-value text-secondary">
          {status === "loading" ? (
            <progress className="progress progress-secondary w-10"></progress>
          ) : (
            piggyBanksIds?.length
          )}
        </div>
        <div className="stat-title">Piggy banks</div>
        {isConnectedAddressPage && (
          <div className="stat-actions">
            <CreatePiggyBankButton />
          </div>
        )}
      </div>
    </div>
  );
};
