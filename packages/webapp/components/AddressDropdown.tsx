import { FC, PropsWithChildren } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  WalletIcon,
  ArrowLeftOnRectangleIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";
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
        rightIcon={<ChevronDownIcon className="h-5 w-5" />}
      >
        {truncatedAddress}
      </MenuButton>
      <MenuList>
        <MenuItem>
          <Link href={`/address/${address}`}>
            <ItemWithIcon
              leftIcon={<WalletIcon className="h-5 w-5" aria-hidden="true" />}
            >
              My Piggies
            </ItemWithIcon>
          </Link>
        </MenuItem>
        <MenuItem onClick={() => copyAddress()}>
          <ItemWithIcon
            leftIcon={<ClipboardIcon className="h-5 w-5" aria-hidden="true" />}
          >
            Copy address
          </ItemWithIcon>
        </MenuItem>
        <MenuItem onClick={() => disconnect()}>
          <ItemWithIcon
            leftIcon={
              <ArrowLeftOnRectangleIcon
                className="h-5 w-5"
                aria-hidden="true"
              />
            }
          >
            Disconnect
          </ItemWithIcon>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
