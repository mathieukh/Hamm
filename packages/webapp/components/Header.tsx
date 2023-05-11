import Link from "next/link";
import { Account } from "./Account";
import { Pacifico } from "next/font/google";
import { Button, Flex, Spacer, Stack, Text } from "@chakra-ui/react";
import { ToggleColorMode } from "./ToggleColorMode";

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] });

export const Header = () => (
  <Flex borderRadius={"xl"} p={2} alignItems="center">
    <Link href="/">
      <Button variant={"ghost"}>
        <Text fontSize="3xl" className={pacifico.className}>
          Hamm
        </Text>
      </Button>
    </Link>
    <Spacer />
    <Stack direction="row" alignItems="center">
      <Account />
      <ToggleColorMode />
    </Stack>
  </Flex>
);
