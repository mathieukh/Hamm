import { FC } from "react";
import { PiggyBanksCounter } from "../components/PiggyBanksCounter";

export const AddressPageContent: FC<{ address: string }> = ({ address }) => {
  return (
    <div className="mt-2 p-2 border">
      <div className="flex flex-row justify-between items-center">
        <PiggyBanksCounter address={address} />
      </div>
    </div>
  );
};
