import { useHammDeletePiggyBank, useHammGetPiggyBankById } from "@/lib/hamm";
import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  CardFooter,
  Text,
  Button,
  Skeleton,
  Stat,
  StatLabel,
  StatNumber,
  Spinner,
  ButtonProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Spacer,
} from "@chakra-ui/react";
import { FC } from "react";
import { Chain, Address } from "viem";
import { useContractAddress } from "../hooks";
import { BigNumberish, ethers } from "ethers";
import { useAccount, useNetwork, useSwitchNetwork, useToken } from "wagmi";
import { truncateAddress } from "@/utils";
import Link from "next/link";
import { DepositPiggyBankForm } from "./DepositPiggyBankForm";
import { WithdrawalPiggyBankForm } from "./WithdrawalPiggyBankForm";
import {
  TrashIcon,
  BanknotesIcon,
  ArrowDownCircleIcon,
} from "@heroicons/react/24/outline";

const Balance: FC<{
  balance: BigNumberish;
  tokenAddress: Address;
  chain: Chain;
}> = ({ balance, tokenAddress, chain }) => {
  const { data, status } = useToken({
    address: tokenAddress,
    chainId: chain.id,
  });
  if (status === "loading") return <Spinner />;
  if (status === "error") return <>Error</>;
  if (data === undefined) return null;
  return (
    <>
      {ethers.utils.formatUnits(balance, data.decimals)} {data.symbol}
    </>
  );
};

const DepositPiggyBankButton: FC<
  ButtonProps & { chain: Chain; piggyBankId: bigint }
> = ({ chain, piggyBankId, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        variant={"outline"}
        leftIcon={<ArrowDownCircleIcon width={15} height={15} />}
        {...props}
        onClick={onOpen}
      >
        {props.children ?? "Deposit"}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true} size={"xs"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Deposit in piggy bank</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <DepositPiggyBankForm chain={chain} piggyBankId={piggyBankId} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const WithdrawPiggyBankButton: FC<
  ButtonProps & { chain: Chain; piggyBankId: bigint }
> = ({ chain, piggyBankId, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        variant={"outline"}
        colorScheme="green"
        leftIcon={<BanknotesIcon width={15} height={15} />}
        {...props}
        onClick={onOpen}
      >
        {props.children ?? "Withdraw"}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true} size={"xs"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Withdraw</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <WithdrawalPiggyBankForm chain={chain} piggyBankId={piggyBankId} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const DeletePiggyBankButton: FC<
  ButtonProps & { chain: Chain; piggyBankId: bigint }
> = ({ chain, piggyBankId, ...props }) => {
  const contractAddress = useContractAddress(chain.id);
  const { write: deletePiggyBank, isLoading } = useHammDeletePiggyBank({
    address: contractAddress,
    args: [piggyBankId],
  });
  return (
    <Button
      variant={"outline"}
      colorScheme="red"
      isLoading={isLoading}
      leftIcon={<TrashIcon height={15} width={15} />}
      {...props}
      onClick={() => deletePiggyBank()}
    >
      {props.children ?? "Delete"}
    </Button>
  );
};

const PiggyActions: FC<{
  chain: Chain;
  piggyBankId: bigint;
  withdrawerAddress: string;
  beneficiaryAddress: string;
}> = ({ chain, piggyBankId, withdrawerAddress, beneficiaryAddress }) => {
  const { address: connectedAddress } = useAccount();
  const { chain: connectedChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork({ chainId: chain.id });
  if (connectedAddress === undefined) return null;
  if (chain.id !== connectedChain?.id)
    return (
      <Button
        size={"sm"}
        variant={"outline"}
        colorScheme={"orange"}
        onClick={() => switchNetwork?.()}
      >
        Switch network
      </Button>
    );
  return (
    <>
      <DepositPiggyBankButton
        size={"sm"}
        chain={chain}
        piggyBankId={piggyBankId}
      />
      {(connectedAddress === withdrawerAddress ||
        connectedAddress === beneficiaryAddress) && (
        <WithdrawPiggyBankButton
          size={"sm"}
          chain={chain}
          piggyBankId={piggyBankId}
        />
      )}
      {connectedAddress === beneficiaryAddress && (
        <>
          <Spacer />
          <DeletePiggyBankButton
            size={"sm"}
            chain={chain}
            piggyBankId={piggyBankId}
          />
        </>
      )}
    </>
  );
};

export const PiggyBankCard: FC<{
  chain: Chain;
  piggyBankId: bigint;
}> = ({ chain, piggyBankId }) => {
  const contractAddress = useContractAddress(chain.id);
  const { data: piggyBank, status } = useHammGetPiggyBankById({
    address: contractAddress,
    chainId: chain.id,
    args: [piggyBankId],
    watch: true,
  });
  if (piggyBank === undefined) return null;
  const [
    name,
    description,
    tokenContractAddress,
    balance,
    beneficiaryAddress,
    withdrawerAddress,
  ] = piggyBank;

  const TokenLink = () => {
    const { blockExplorers } = chain;
    if (blockExplorers === undefined)
      return <>{truncateAddress(tokenContractAddress)}</>;
    return (
      <a
        href={
          new URL(
            `/address/${tokenContractAddress}`,
            blockExplorers.default.url
          ).href
        }
      >
        {truncateAddress(tokenContractAddress)}
      </a>
    );
  };

  return (
    <Skeleton isLoaded={status !== "loading"}>
      <Card variant={"elevated"} size={"sm"}>
        <CardHeader>
          <Heading size="md">
            <Link
              href={{
                pathname: "/chain/[chainId]/piggy/[piggyBankId]",
                query: {
                  chainId: chain.id.toString(),
                  piggyBankId: piggyBankId.toString(),
                },
              }}
            >
              <Button variant={"link"}>#{piggyBankId.toString()}</Button>
            </Link>{" "}
            - {name}
          </Heading>
        </CardHeader>
        <CardBody display={"flex"} gap={2} flexDirection={"column"}>
          <Stat flex={"auto"}>
            <StatLabel>Balance</StatLabel>
            <StatNumber>
              <Balance
                balance={balance}
                chain={chain}
                tokenAddress={tokenContractAddress}
              />
            </StatNumber>
          </Stat>
          <Text>{description}</Text>
          <Text fontSize={"xs"}>
            <Text as={"span"} fontWeight={"semibold"}>
              Contract address:{" "}
            </Text>
            <TokenLink />
          </Text>
          <Text fontSize={"xs"}>
            <Text as={"span"} fontWeight={"semibold"}>
              Beneficiary address:{" "}
            </Text>
            <Link href={`/address/${beneficiaryAddress}`}>
              {truncateAddress(beneficiaryAddress)}
            </Link>
          </Text>
          <Text fontSize={"xs"}>
            <Text as={"span"} fontWeight={"semibold"}>
              Withdrawer address:{" "}
            </Text>
            <Link href={`/address/${withdrawerAddress}`}>
              {truncateAddress(withdrawerAddress)}
            </Link>
          </Text>
        </CardBody>
        <CardFooter gap={2}>
          <PiggyActions
            chain={chain}
            piggyBankId={piggyBankId}
            withdrawerAddress={withdrawerAddress}
            beneficiaryAddress={beneficiaryAddress}
          />
        </CardFooter>
      </Card>
    </Skeleton>
  );
};
