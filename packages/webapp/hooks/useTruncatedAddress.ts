import { useAddress } from "@thirdweb-dev/react";
import { truncateAddress } from "@/utils";

export const useTruncatedAddress = () => {
  const address = useAddress();
  return { truncatedAddress: address && truncateAddress(address), address };
};
