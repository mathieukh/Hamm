import { useAccount } from "wagmi";
import { useToast } from "@chakra-ui/react";

export const useCopyAddress = () => {
  const { address } = useAccount();
  const toast = useToast();
  return () => {
    if (address !== undefined) {
      navigator.clipboard.writeText(address).then(() => {
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
