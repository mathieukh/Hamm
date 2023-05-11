import Link from "next/link";
import { Account } from "./Account";
import { Pacifico } from "next/font/google";
import { Flex, Spacer } from "@chakra-ui/react";

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] });

export const Header = () => (
  <Flex>
    <Link
      href="/"
      className={`btn btn-ghost normal-case text-3xl ${pacifico.className}`}
    >
      Hamm
    </Link>
    <Spacer />
    <Account />
  </Flex>
);
