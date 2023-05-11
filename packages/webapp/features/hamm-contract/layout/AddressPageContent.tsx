import { FC } from "react";
import { PiggyBanksCounter } from "../components/PiggyBanksCounter";
import { Address, useNetwork } from "wagmi";
import { Box, Heading, Stack } from "@chakra-ui/react";
import { CreatePiggyBankButton } from "../components/CreatePiggyBankButton";

export const AddressPageContent: FC<{ address: Address }> = ({ address }) => {
  const { chain } = useNetwork();
  return (
    <Box marginTop={5}>
      <Stack gap={2} maxWidth={"max-content"}>
        <Heading size={"lg"}>Piggy banks</Heading>
        <PiggyBanksCounter address={address} />
        {chain && !chain.unsupported && (
          <CreatePiggyBankButton size={"sm"} variant={"outline"}>
            Create a piggy bank
          </CreatePiggyBankButton>
        )}
      </Stack>
    </Box>
  );
};
