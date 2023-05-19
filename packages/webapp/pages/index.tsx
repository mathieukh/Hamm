import { CreatePiggyBankButton } from "@/features/hamm-contract/components/CreatePiggyBankButton";
import PageLayout from "@/layout/PageLayout";
import { Stack, Heading, Box, Text } from "@chakra-ui/react";
import Head from "next/head";
import { TbPig } from "react-icons/tb";

const Home = () => (
  <PageLayout>
    <Head>
      <title>Hamm</title>
    </Head>
    <Stack
      as={Box}
      alignItems={"center"}
      textAlign={"center"}
      spacing={{ base: 8, md: 12 }}
      py={{ base: 20, md: 36 }}
    >
      <TbPig size={"10em"} />
      <Heading
        fontWeight={600}
        fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
        lineHeight={"110%"}
      >
        Create piggy banks <br />
        <Text as={"span"} color={"pink.400"}>
          on-chain
        </Text>
      </Heading>
      <Text color={"gray.500"}>
        Creates as much piggy banks as you want to help you save money for your
        plans.
        <br />
        Each piggy bank has a name, a description, an owner and a ERC20 token
        associated to it.
        <br />
        A piggy bank is a ERC721 NFT minted when it is created and the owner
        will be the beneficiary of the piggy bank.
        <br />
        It can be transfer to another user which will become the new owner of
        the piggy bank.
        <br />A piggy bank is associated to a ERC20 token which will be the only
        token that can be use for the piggy bank.
      </Text>
      <Stack
        direction={"column"}
        spacing={3}
        align={"center"}
        alignSelf={"center"}
        position={"relative"}
      >
        <CreatePiggyBankButton
          colorScheme={"pink"}
          bg={"pink.400"}
          rounded={"full"}
          px={6}
          _hover={{
            bg: "pink.500",
          }}
        >
          Create a piggy bank
        </CreatePiggyBankButton>
      </Stack>
    </Stack>
  </PageLayout>
);

export default Home;
