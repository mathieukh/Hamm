import {
	Button,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
} from "@chakra-ui/react";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { IoWarningOutline } from "react-icons/io5";
import { useNetwork } from "wagmi";
import { ChooseChainDropdown } from "./ChooseChainDropdown";
import { ToggleColorMode } from "./ToggleColorMode";

export const Settings = () => {
	const { chain } = useNetwork();
	const OpenMenuButton = () => {
		if (chain?.unsupported) {
			return (
				<MenuButton
					as={Button}
					variant={"outline"}
					colorScheme={"orange"}
					leftIcon={<IoWarningOutline width={15} height={15} />}
				>
					Wrong Network
				</MenuButton>
			);
		}
		return (
			<MenuButton
				as={IconButton}
				variant={"outline"}
				icon={<HiOutlineCog6Tooth width={15} height={15} />}
			/>
		);
	};
	return (
		<Menu closeOnSelect={false}>
			<OpenMenuButton />
			<MenuList>
				<ChooseChainDropdown />
				<MenuItem>
					<ToggleColorMode />
				</MenuItem>
			</MenuList>
		</Menu>
	);
};
