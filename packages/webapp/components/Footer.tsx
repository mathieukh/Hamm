import { Button, HStack, Link, type StackProps } from "@chakra-ui/react";
import type { FC } from "react";
import { FiMail } from "react-icons/fi";
import { SiGithub } from "react-icons/si";

export const Footer: FC<StackProps> = (props) => (
	<HStack spacing={10} justifyContent={"center"} {...props}>
		<Link href="https://github.com/khalypso-fr/Hamm" isExternal>
			<Button
				variant={"link"}
				alignItems={"center"}
				rightIcon={<SiGithub size={20} />}
			>
				Go to source code
			</Button>
		</Link>
		<Link href="mailto:hello@hamm.finance" isExternal>
			<Button
				variant={"link"}
				alignItems={"center"}
				rightIcon={<FiMail size={20} />}
			>
				Contact me
			</Button>
		</Link>
	</HStack>
);
