import { useContractRead } from "@thirdweb-dev/react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useHammContract } from "./useHammContract";
import { BigNumber } from "ethers";

export const usePiggyBanksIds = (
  address: string
): UseQueryResult<Array<BigNumber>> => {
  const { contract: hammContract } = useHammContract();
  return useContractRead(hammContract, "getPiggyBankIdsForAddress", [address]);
};
