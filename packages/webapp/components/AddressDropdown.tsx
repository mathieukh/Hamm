import { useCopyAddress, useTruncatedAddress } from "@/hooks";
import {
	Button,
	Flex,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
} from "@chakra-ui/react";
import Link from "next/link";
import type { FC, PropsWithChildren } from "react";
import { HiChevronDown, HiOutlineClipboard } from "react-icons/hi";
import {
	HiOutlineArrowLeftOnRectangle,
	HiOutlineWallet,
} from "react-icons/hi2";
import { useDisconnect } from "wagmi";

const ItemWithIcon: FC<PropsWithChildren<{ leftIcon: React.ReactNode }>> = ({
	children,
	leftIcon,
}) => (
	<Flex alignContent={"center"} alignItems={"center"} gap={2}>
		{leftIcon}
		{children}
	</Flex>
);

export const AddressDropdown: FC = () => {
	const { truncatedAddress, address } = useTruncatedAddress();
	const { disconnect } = useDisconnect();
	const copyAddress = useCopyAddress();
	if (address === undefined) return null;
	return (
		<Menu>
			<MenuButton
				as={Button}
				variant={"outline"}
				rightIcon={<HiChevronDown width={20} height={20} />}
			>
				{truncatedAddress}
			</MenuButton>
			<MenuList>
				<MenuItem>
					<Link href={`/address/${address}`}>
						<ItemWithIcon leftIcon={<HiOutlineWallet width={20} height={20} />}>
							My Piggies
						</ItemWithIcon>
					</Link>
				</MenuItem>
				<MenuItem onClick={() => copyAddress()}>
					<ItemWithIcon
						leftIcon={<HiOutlineClipboard width={20} height={20} />}
					>
						Copy address
					</ItemWithIcon>
				</MenuItem>
				<MenuItem onClick={() => disconnect()}>
					<ItemWithIcon
						leftIcon={<HiOutlineArrowLeftOnRectangle width={20} height={20} />}
					>
						Disconnect
					</ItemWithIcon>
				</MenuItem>
			</MenuList>
		</Menu>
	);
};
