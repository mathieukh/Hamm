import { FC } from "react";
import { PiggyBanksCounter } from "../components/PiggyBanksCounter";
import { Address, useNetwork } from "wagmi";
import {
  Divider,
  Flex,
  Heading,
  IconButton,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { CreatePiggyBankButton } from "../components/CreatePiggyBankButton";
import { PiggyBanksGridForChain } from "../components/PiggyBanksGridForChain";
import { supportedChains } from "@/config";
import { HiOutlineClipboard, HiPlusCircle } from "react-icons/hi";
import { useCopyAddress } from "@/hooks";

const AddressFromPage: FC<{ address: Address }> = ({ address }) => {
  const copyAddress = useCopyAddress(address);
  return (
    <Flex alignItems={"center"} gap={2}>
      <Heading size={"sm"}>{address}</Heading>
      <IconButton
        size={"xs"}
        variant={"ghost"}
        aria-label="copy-address"
        icon={<HiOutlineClipboard height={15} width={15} />}
        onClick={copyAddress}
      />
    </Flex>
  );
};

export const AddressPageContent: FC<{ address: Address }> = ({ address }) => {
  const { chain } = useNetwork();
  return (
    <Stack marginTop={5} gap={2}>
      <Stack gap={2} maxWidth={"max-content"}>
        <Heading size={"lg"}>Piggy banks</Heading>
        <AddressFromPage address={address} />
        <PiggyBanksCounter address={address} />
        {chain && !chain.unsupported && (
          <CreatePiggyBankButton
            size={"sm"}
            variant={"outline"}
            leftIcon={<HiPlusCircle width={20} height={20} />}
          >
            Create a piggy bank
          </CreatePiggyBankButton>
        )}
      </Stack>
      <Divider />
      <SimpleGrid gap={3} columns={{ sm: 1, md: 2, xl: 3 }}>
        {supportedChains.map((chain) => (
          <PiggyBanksGridForChain
            key={chain.id}
            chain={chain}
            address={address}
          />
        ))}
      </SimpleGrid>
    </Stack>
  );
};
