import { FC } from "react";
import { PiggyBanksCounter } from "../components/PiggyBanksCounter";
import { Address } from "wagmi";

export const AddressPageContent: FC<{ address: Address }> = ({ address }) => {
  return (
    <div className="mt-4">
      <div className="flex flex-row justify-between items-center">
        <PiggyBanksCounter address={address} />
      </div>
    </div>
  );
};
