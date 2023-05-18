import { FC, PropsWithChildren } from "react";
import {HiChevronDown, HiOutlineClipboard } from "react-icons/hi"
import { HiOutlineWallet, HiOutlineArrowLeftOnRectangle } from "react-icons/hi2"
import { useCopyAddress, useTruncatedAddress } from "@/hooks";
import { useDisconnect } from "wagmi";
import Link from "next/link";
import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Flex,
} from "@chakra-ui/react";

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
          <ItemWithIcon leftIcon={<HiOutlineClipboard width={20} height={20} />}>
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
