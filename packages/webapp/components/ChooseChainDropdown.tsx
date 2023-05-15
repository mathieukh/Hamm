import { FC, useEffect, useState } from "react";
import { supportedChains } from "@/config";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { MenuOptionGroup, MenuItemOption, useToast } from "@chakra-ui/react";

export const ChooseChainDropdown: FC = () => {
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const toast = useToast();
  const [chainId, setChainId] = useState(String(chain?.id));
  useEffect(() => {
    setChainId(String(chain?.id));
  }, [chain?.id]);
  if (!chain) return null;
  return (
    <MenuOptionGroup
      value={chainId}
      title="Network"
      type="radio"
      onChange={(idToSwitch) => {
        switchNetworkAsync?.(Number(idToSwitch)).catch(() => {
          toast({
            status: "error",
            title: "Oups",
            description: "Can not switch the network",
          });
        });
      }}
    >
      {supportedChains.map(({ id, name }) => (
        <MenuItemOption key={id} value={String(id)}>
          {name}
        </MenuItemOption>
      ))}
    </MenuOptionGroup>
  );
};
