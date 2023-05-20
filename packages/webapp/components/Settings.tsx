import {
  Menu,
  MenuButton,
  MenuList,
  IconButton,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { IoWarningOutline } from "react-icons/io5";
import { ToggleColorMode } from "./ToggleColorMode";
import { ChooseChainDropdown } from "./ChooseChainDropdown";
import { useNetwork } from "wagmi";

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
