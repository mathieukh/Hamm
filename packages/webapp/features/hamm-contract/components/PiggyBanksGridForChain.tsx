import { useHammGetPiggyBankIdsForAddress } from "@/lib/hamm";
import { FC } from "react";
import { Chain, Address } from "viem";
import { useContractAddress } from "../hooks";
import { PiggyBankCard } from "./PiggyBankCard";

export const PiggyBanksGridForChain: FC<{ chain: Chain; address: Address }> = ({
  chain,
  address,
}) => {
  const contractAddress = useContractAddress(chain.id);
  const { data: piggyBanksIds, status } = useHammGetPiggyBankIdsForAddress({
    address: contractAddress,
    chainId: chain.id,
    args: [address],
    watch: true,
  });
  if (status === "error") {
    return null;
  }
  return (
    <>
      {piggyBanksIds?.map((piggyBankId, index) => (
        <PiggyBankCard key={index} chain={chain} piggyBankId={piggyBankId} />
      ))}
    </>
  );
};
