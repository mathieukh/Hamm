import { useAccount } from "wagmi";
import { toast } from "react-toastify";

export const useCopyAddress = () => {
  const { address } = useAccount();
  return () => {
    if (address !== undefined) {
      navigator.clipboard.writeText(address).then(() => {
        toast("The address has been copied in your clipboard");
      });
    }
  };
};
