import { Switch, useColorMode, FormControl, FormLabel } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export const ToggleColorMode = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <FormControl display="flex" alignItems="center">
      <FormLabel htmlFor="toggle-mode" mb="0">
        Toggle Mode?
      </FormLabel>
      <Switch
        id="toggle-mode"
        size="md"
        isChecked={isDark}
        onChange={() => toggleColorMode()}
      />
    </FormControl>
  );
};
