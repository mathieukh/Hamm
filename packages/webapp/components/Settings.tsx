import {
  Menu,
  MenuButton,
  MenuList,
  IconButton,
  MenuItem,
} from "@chakra-ui/react";
import {HiOutlineCog6Tooth} from "react-icons/hi2"
import { ToggleColorMode } from "./ToggleColorMode";
import { ChooseChainDropdown } from "./ChooseChainDropdown";

export const Settings = () => {
  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        as={IconButton}
        variant={"outline"}
        icon={<HiOutlineCog6Tooth width={15} height={15} />}
      />
      <MenuList>
        <ChooseChainDropdown />
        <MenuItem>
          <ToggleColorMode />
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
