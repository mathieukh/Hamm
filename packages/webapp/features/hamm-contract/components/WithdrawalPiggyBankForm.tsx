import {
  useHammCalculateFee,
  useHammGetPiggyBankById,
  useHammWithdrawalPiggyBank,
} from "@/lib/hamm";
import { FC } from "react";
import { Chain, useAccount, useToken, Address } from "wagmi";
import { useContractAddress } from "../hooks";
import {
  Spinner,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Button,
  useToast,
  StatHelpText,
} from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import { waitForTransaction } from "@wagmi/core";

const WithdrawalPiggyBankFormInternal: FC<{
  chain: Chain;
  piggyBank: { id: bigint; balance: bigint };
  token: { decimals: number; symbol: string; address: Address };
}> = ({ chain, piggyBank, token }) => {
  const toast = useToast();
  const { address: connectedAddress } = useAccount();
  const contractAddress = useContractAddress(chain.id);
  const { writeAsync: withdraw } = useHammWithdrawalPiggyBank({
    address: contractAddress,
    chainId: chain.id,
    args: [piggyBank.id],
  });
  const { data: fee = BigNumber.from(0).toBigInt(), isLoading: isLoadingFee } =
    useHammCalculateFee({
      address: contractAddress,
      chainId: chain.id,
      args: [piggyBank.balance],
      watch: true,
    });
  if (contractAddress === undefined || connectedAddress === undefined)
    return null;
  const onWithdraw = () =>
    withdraw()
      .then((tx) => waitForTransaction({chainId: chain.id, hash: tx.hash}).then(() => {
        toast({
          status: "success",
          title: "Great!",
          description: `You have withdrawed your piggy bank`,
        });
      }))
      .catch(() => {
        toast({
          status: "error",
          title: "Oups!",
          description: `Fail to withdraw your piggy bank.`,
        });
      });
  return (
    <Stack alignItems={"center"}>
      <Stat flex={"auto"}>
        <StatLabel>Piggy balance</StatLabel>
        <StatNumber>
          {ethers.utils.formatUnits(piggyBank.balance, token.decimals)}{" "}
          {token.symbol}
        </StatNumber>
        <StatHelpText>
          Fee:{" "}
          {isLoadingFee ? (
            <Spinner size={"xs"} />
          ) : (
            ethers.utils.formatUnits(fee, token.decimals)
          )}{" "}
          {token.symbol}
        </StatHelpText>
      </Stat>
      <Button variant={"outline"} colorScheme="red" onClick={onWithdraw}>
        Withdraw
      </Button>
    </Stack>
  );
};

export const WithdrawalPiggyBankForm: FC<{
  piggyBankId: bigint;
  chain: Chain;
}> = ({ piggyBankId, chain }) => {
  const contractAddress = useContractAddress(chain.id);
  const { data: piggyBank, status: piggyBankStatus } = useHammGetPiggyBankById({
    address: contractAddress,
    chainId: chain.id,
    args: [piggyBankId],
    watch: true,
  });
  const tokenContractAddress = piggyBank?.[2];
  const { data: tokenInfo, status: tokenInfoStatus } = useToken({
    address: tokenContractAddress,
    chainId: chain.id,
  });
  if (piggyBankStatus === "loading" || tokenInfoStatus === "loading")
    return <Spinner />;
  if (piggyBank === undefined || tokenInfo === undefined) return null;
  const balance = piggyBank[3];
  return (
    <WithdrawalPiggyBankFormInternal
      chain={chain}
      piggyBank={{ balance, id: piggyBankId }}
      token={tokenInfo}
    />
  );
};
