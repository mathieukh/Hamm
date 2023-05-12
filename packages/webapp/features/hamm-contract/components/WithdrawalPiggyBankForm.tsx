import {
  useHammDepositPiggyBank,
  useHammGetPiggyBankById,
  useHammWithdrawalPiggyBank,
} from "@/lib/hamm";
import { FC, useMemo, useState } from "react";
import { Chain, useAccount, useToken, Address } from "wagmi";
import { useContractAddress } from "../hooks";
import {
  Input,
  Spinner,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Button,
  useToast,
  NumberInput,
  NumberInputField,
  FormControl,
  FormLabel,
  FormHelperText,
  Text,
} from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";

const WithdrawalPiggyBankFormInternal: FC<{
  chain: Chain;
  piggyBank: { id: bigint; balance: bigint };
  token: { decimals: number; symbol: string; address: Address };
}> = ({ chain, piggyBank, token }) => {
  const toast = useToast();
  const { address: connectedAddress } = useAccount();
  const contractAddress = useContractAddress(chain.id);
  const [tip, setTip] = useState("0");
  const tipAsBigNumber = useMemo(() => {
    try {
      return ethers.utils.parseUnits(tip, token.decimals).toBigInt();
    } catch {
      return BigNumber.from(0).toBigInt();
    }
  }, [tip, token.decimals]);
  const { writeAsync: withdraw } = useHammWithdrawalPiggyBank({
    address: contractAddress,
    chainId: chain.id,
    args: [piggyBank.id, tipAsBigNumber],
  });
  if (contractAddress === undefined || connectedAddress === undefined)
    return null;
  const onWithdraw = async () => {
    return withdraw()
      .then(() => {
        toast({
          status: "success",
          title: "Great!",
          description: `You have withdrawed your piggy bank`,
        });
      })
      .catch(() => {
        toast({
          status: "error",
          title: "Oups!",
          description: `Fail to withdraw your piggy bank. Make sure your tip is not greater than your `,
        });
      });
  };
  return (
    <Stack alignItems={"center"}>
      <Stat flex={"auto"}>
        <StatLabel>Balance</StatLabel>
        <StatNumber>
          {ethers.utils.formatUnits(piggyBank.balance, token.decimals)}{" "}
          {token.symbol}
        </StatNumber>
      </Stat>
      <FormControl as="fieldset">
        <FormLabel as="legend">Support the development:</FormLabel>
        <NumberInput
          size={"xs"}
          min={0}
          value={tip}
          onChange={(newTip) => {
            setTip(newTip);
          }}
        >
          <NumberInputField />
        </NumberInput>
        <FormHelperText>
          <Text>
            <Text as="span" fontWeight={"bold"}>
              Tip:
            </Text>{" "}
            {ethers.utils.formatUnits(tipAsBigNumber, token.decimals)}{" "}
            {token.symbol} -{" "}
            <Text as="span" fontWeight={"bold"}>
              Withdrawed:
            </Text>{" "}
            {ethers.utils.formatUnits(
              piggyBank.balance - tipAsBigNumber,
              token.decimals
            )}{" "}
            {token.symbol}
          </Text>
          <Text>
            You can leave an amount of your piggy bank to the DApp creator.
          </Text>
        </FormHelperText>
      </FormControl>
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
