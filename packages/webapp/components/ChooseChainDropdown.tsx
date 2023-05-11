import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { FC } from "react";
import { supportedChains } from "@/config";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { Menu, MenuButton, Button, MenuList, MenuItem } from "@chakra-ui/react";

const ChainAvatar: FC = () => {
  const { chain } = useNetwork();
  if (chain === undefined) return null;
  if (chain.unsupported)
    return <button className="text-red-600">Wrong network</button>;
  const { name } = chain;
  return <>{name}</>;
};

export const ChooseChainDropdown: FC = () => {
  const { isConnected } = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  if (!isConnected) return null;
  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon width={20} height={20} />}
      >
        <ChainAvatar />
      </MenuButton>
      <MenuList>
        {supportedChains.map(({ id, name }) => (
          <MenuItem key={id} onClick={() => switchNetwork?.(id)}>
            {name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
