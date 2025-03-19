import {
	Button,
	Flex,
	type FlexProps,
	Spacer,
	Stack,
	Text,
} from "@chakra-ui/react";
import { Pacifico } from "next/font/google";
import Link from "next/link";
import type { FC } from "react";
import { Account } from "./Account";
import { Settings } from "./Settings";

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
