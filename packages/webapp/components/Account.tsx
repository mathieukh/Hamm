import type { FC } from "react";
import { useAccount } from "wagmi";
import { AddressDropdown } from "./AddressDropdown";
import { ConnectWalletButton } from "./ConnectWalletButton";

export const Account: FC = () => {
	const { isConnected } = useAccount();
	if (!isConnected) return <ConnectWalletButton />;
	return <AddressDropdown />;
};
