import { supportedChains } from "@/config";
import { useHammGetPiggyBankIdsForAddress } from "@/lib/hamm";
import {
	IconButton,
	Spinner,
	Stat,
	StatGroup,
	StatLabel,
	StatNumber,
	Text,
} from "@chakra-ui/react";
import type { FC } from "react";
import { HiOutlineArrowPath } from "react-icons/hi2";
import type { Address, Chain } from "wagmi";
import { useContractAddress } from "../hooks";

const PiggyBanksCounterForChain: FC<{ chain: Chain; address: Address }> = ({
	chain,
	address,
}) => {
	const contractAddress = useContractAddress(chain.id);
	const {
		data: piggyBanksIds,
		status,
		refetch,
	} = useHammGetPiggyBankIdsForAddress({
		address: contractAddress,
		chainId: chain.id,
		args: [address],
		watch: true,
	});
	const StatContent: FC = () => {
		if (status === "loading") return <Spinner />;
		if (status === "error")
			return (
				<IconButton
					variant="ghost"
					aria-label="error-on-fetch-piggy-ids"
					onClick={() => refetch()}
					icon={<HiOutlineArrowPath width={25} height={25} />}
				/>
			);
		if (status === "success") return <>{piggyBanksIds?.length}</>;
		return null;
	};
	return (
		<Stat flex={"auto"}>
			<StatLabel fontSize={"xs"}>{chain.name}</StatLabel>
			<StatNumber>
				<StatContent />
			</StatNumber>
		</Stat>
	);
};

export const PiggyBanksCounter: FC<{ address: Address }> = ({ address }) => (
	<StatGroup gap={4}>
		{supportedChains.map((chain) => (
			<PiggyBanksCounterForChain
				key={chain.id}
				chain={chain}
				address={address}
			/>
		))}
	</StatGroup>
);
