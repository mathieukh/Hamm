import { truncateAddress } from "@/utils";
import { useAccount } from "wagmi";

export const useTruncatedAddress = () => {
  const { address } = useAccount();
  return { truncatedAddress: address && truncateAddress(address), address };
};
