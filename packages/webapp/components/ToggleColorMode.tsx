import { Stack, Switch, useColorMode } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export const ToggleColorMode = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Stack alignItems={"center"}>
      {colorMode === "dark" ? (
        <MoonIcon width={15} height={15} />
      ) : (
        <SunIcon width={15} height={15} />
      )}
      <Switch
        size="sm"
        isChecked={colorMode === "dark"}
        onChange={() => toggleColorMode()}
      />
    </Stack>
  );
};
