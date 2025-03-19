import { Button, type ButtonProps } from "@chakra-ui/react";
import type { FC } from "react";
import { useSwitchNetwork } from "wagmi";

export const SwitchNetworkButton: FC<ButtonProps & { chainId: number }> = ({
	chainId,
	...props
}) => {
	const { switchNetwork } = useSwitchNetwork({ chainId });
	return (
		<Button {...props} onClick={() => switchNetwork?.()}>
			{props.children ?? "Switch network"}
		</Button>
	);
};
