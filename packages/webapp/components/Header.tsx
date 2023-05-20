import Link from "next/link";
import { Account } from "./Account";
import { Pacifico } from "next/font/google";
import { Button, Flex, FlexProps, Spacer, Stack, Text } from "@chakra-ui/react";
import { Settings } from "./Settings";
import { FC } from "react";

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] });

export const Header: FC<FlexProps> = (props) => (
  <Flex {...props} borderRadius={"xl"} p={2} alignItems="center">
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
      <Settings />
    </Stack>
  </Flex>
);
