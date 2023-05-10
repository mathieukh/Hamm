import React, { useContext } from "react";
import { Address } from "wagmi";
import { useContractAddress } from "../hooks";
import { useHammCreateNewPiggyBank } from "@/lib/hamm";

export const PiggyBankFormContext = React.createContext<{
  beneficiaryAddress: Address | undefined;
  withdrawerAddress: Address | undefined;
  name: string | undefined;
  description: string | undefined;
  tokenContractAddress: Address | undefined;
}>({
  beneficiaryAddress: undefined,
  withdrawerAddress: undefined,
  name: undefined,
  description: undefined,
  tokenContractAddress: undefined,
});

export const useCreatePiggyBank = () => {
  const {
    beneficiaryAddress,
    withdrawerAddress,
    name,
    description,
    tokenContractAddress,
  } = useContext(PiggyBankFormContext);
  const contractAddress = useContractAddress();
  const { writeAsync } = useHammCreateNewPiggyBank({
    address: contractAddress,
  });
  return {
    createPiggyBank: () => {
      if (beneficiaryAddress === undefined)
        throw new Error("Beneficiary address must be defined");
      if (withdrawerAddress === undefined)
        throw new Error("Withdrawer address must be defined");
      if (name === undefined) throw new Error("Name must be defined");
      if (description === undefined)
        throw new Error("Description must be defined");
      if (tokenContractAddress === undefined)
        throw new Error("Token contract address must be defined");
      return writeAsync({
        args: [
          beneficiaryAddress,
          withdrawerAddress,
          name,
          description,
          tokenContractAddress,
        ],
      });
    },
  };
};
