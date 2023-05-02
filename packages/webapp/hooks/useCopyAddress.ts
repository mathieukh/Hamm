import { useAddress } from "@thirdweb-dev/react";
import { toast } from "react-toastify";

export const useCopyAddress = () => {
  const address = useAddress();
  return () => {
    if (address !== undefined) {
      navigator.clipboard.writeText(address).then(() => {
        toast("The address has been copied in your clipboard");
      });
    }
  };
};
