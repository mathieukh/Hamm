import { supportedChains } from "@/config";
import { MenuItemOption, MenuOptionGroup, useToast } from "@chakra-ui/react";
import { type FC, useEffect, useState } from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";

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
