import { useChainId, useContract } from "@thirdweb-dev/react";
import { abi } from "./abi";

const contractAddresses = {
  250: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_250,
  1337: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_1337,
  42161: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_42161,
  421613: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_421613,
  4002: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_4002,
} as Record<number, string>;

export const useHammContract = () => {
  const chainId = useChainId();
  const contractAddressForChain =
    chainId !== undefined ? contractAddresses[chainId] : undefined;
  return useContract(contractAddressForChain, abi);
};
