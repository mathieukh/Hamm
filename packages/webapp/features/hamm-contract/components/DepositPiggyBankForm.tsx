import { useHammDepositPiggyBank, useHammGetPiggyBankById } from "@/lib/hamm";
import { FC, useMemo, useState } from "react";
import { Chain, useAccount, useToken, Address, useBalance } from "wagmi";
import {
  erc20ABI,
  writeContract,
  waitForTransaction,
  readContract,
} from "@wagmi/core";
import { useContractAddress } from "../hooks";
import {
  Spinner,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Button,
  useToast,
  NumberInput,
  NumberInputField,
  StatHelpText,
} from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";

const DepositPiggyBankFormInternal: FC<{
  chain: Chain;
  piggyBank: { id: bigint; balance: bigint };
  token: { decimals: number; symbol: string; address: Address };
}> = ({ chain, piggyBank, token }) => {
  const toast = useToast();
  const { address: connectedAddress } = useAccount();
  const contractAddress = useContractAddress(chain.id);
  const [amount, setAmount] = useState("0");
  const amountAsBigNumber = useMemo(() => {
    try {
      return ethers.utils.parseUnits(amount, token.decimals).toBigInt();
    } catch {
      return BigNumber.from(0).toBigInt();
    }
  }, [amount, token.decimals]);
  const { writeAsync: deposit, isLoading } = useHammDepositPiggyBank({
    address: contractAddress,
    chainId: chain.id,
    args: [piggyBank.id, amountAsBigNumber],
  });
  const { data: tokenBalance } = useBalance({
    address: connectedAddress,
    token: token.address,
    chainId: chain.id,
    watch: true,
  });
  const isLoadingBalance = false;
  if (contractAddress === undefined || connectedAddress === undefined)
    return null;
  const onDeposit = async () => {
    const allowed = await readContract({
      address: token.address,
      chainId: chain.id,
      abi: erc20ABI,
      functionName: "allowance",
      args: [connectedAddress, contractAddress],
    });
    if (allowed < amountAsBigNumber) {
      const { hash: approvedHash } = await writeContract({
        address: token.address,
        chainId: chain.id,
        abi: erc20ABI,
        functionName: "approve",
        args: [contractAddress, amountAsBigNumber],
      });
      const receipt = await waitForTransaction({
        hash: approvedHash,
        chainId: chain.id,
      });
      if (receipt.status === "reverted") {
        toast({
          status: "error",
          title: "Token usage not allowed",
          description: "Unable to allow the token usage on the contract",
        });
        return;
      }
    }
    return deposit()
      .then((tx) =>
        waitForTransaction({ chainId: chain.id, hash: tx.hash }).then(
          (txResult) => {
            if (txResult.status === "reverted") {
              throw new Error("Transaction reverted.");
            }
            toast({
              status: "success",
              title: "Great!",
              description: `You have deposited ${ethers.utils.formatUnits(
                amountAsBigNumber,
                token.decimals
              )} ${token.symbol}`,
            });
          }
        )
      )
      .catch(() => {
        toast({
          status: "error",
          title: "Oups!",
          description: "Can not deposit in the piggy bank",
        });
      });
  };
  return (
    <Stack alignItems={"center"}>
      <Stat flex={"auto"}>
        <StatLabel>My Balance</StatLabel>
        <StatNumber>
          {isLoadingBalance ? <Spinner /> : tokenBalance?.formatted}{" "}
          {token.symbol}
        </StatNumber>
        <StatHelpText>
          Piggy balance:{" "}
          {ethers.utils.formatUnits(piggyBank.balance, token.decimals)}{" "}
          {token.symbol}
        </StatHelpText>
      </Stat>
      <NumberInput
        min={0}
        value={amount}
        onChange={(newAmount) => {
          setAmount(newAmount);
        }}
      >
        <NumberInputField />
      </NumberInput>
      <Button onClick={onDeposit} isLoading={isLoading}>
        Deposit
      </Button>
    </Stack>
  );
};

export const DepositPiggyBankForm: FC<{
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
    <DepositPiggyBankFormInternal
      chain={chain}
      piggyBank={{ balance, id: piggyBankId }}
      token={tokenInfo}
    />
  );
};
