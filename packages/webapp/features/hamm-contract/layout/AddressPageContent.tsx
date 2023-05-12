import { FC } from "react";
import { PiggyBanksCounter } from "../components/PiggyBanksCounter";
import { Address, useNetwork } from "wagmi";
import { Divider, Heading, Stack } from "@chakra-ui/react";
import { CreatePiggyBankButton } from "../components/CreatePiggyBankButton";
import { PiggyBanksGridForChain } from "../components/PiggyBanksGridForChain";
import { supportedChains } from "@/config";

export const AddressPageContent: FC<{ address: Address }> = ({ address }) => {
  const { chain } = useNetwork();
  return (
    <Stack marginTop={5} gap={2}>
      <Stack gap={2} maxWidth={"max-content"}>
        <Heading size={"lg"}>Piggy banks</Heading>
        <PiggyBanksCounter address={address} />
        {chain && !chain.unsupported && (
          <CreatePiggyBankButton size={"sm"} variant={"outline"}>
            Create a piggy bank
          </CreatePiggyBankButton>
        )}
      </Stack>
      <Divider />
      {supportedChains.map((chain) => (
        <PiggyBanksGridForChain
          key={chain.id}
          chain={chain}
          address={address}
        />
      ))}
    </Stack>
  );
};
