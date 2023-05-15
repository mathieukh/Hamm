import {
  Menu,
  MenuButton,
  MenuList,
  IconButton,
  MenuItem,
} from "@chakra-ui/react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { ToggleColorMode } from "./ToggleColorMode";
import { ChooseChainDropdown } from "./ChooseChainDropdown";

export const Settings = () => {
  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        as={IconButton}
        variant={"outline"}
        icon={<Cog6ToothIcon width={15} height={15} />}
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
