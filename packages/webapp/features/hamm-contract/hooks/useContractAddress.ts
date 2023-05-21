import { CONTRACT_ADDRESSES } from "@/config";
import { useNetwork } from "wagmi";

export const useContractAddress = (chainId?: number) => {
  const { chain } = useNetwork();
  const contractChainId = chainId ?? chain?.id;
  const contractAddress =
    contractChainId !== undefined
      ? CONTRACT_ADDRESSES[contractChainId]
      : undefined;
  return contractAddress;
};
