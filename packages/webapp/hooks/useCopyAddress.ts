import { Address, useAccount } from "wagmi";
import { useToast } from "@chakra-ui/react";

export const useCopyAddress = (addressToCopy?: Address) => {
  const { address } = useAccount();
  const toast = useToast();
  addressToCopy = addressToCopy ?? address;
  return () => {
    if (addressToCopy !== undefined) {
      navigator.clipboard.writeText(addressToCopy).then(() => {
        toast({
          title: "Address copied",
          description: "The address has been copied in your clipboard",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      });
    }
  };
};
