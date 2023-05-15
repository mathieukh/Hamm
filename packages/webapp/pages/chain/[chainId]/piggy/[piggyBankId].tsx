import { supportedChains } from "@/config";
import { PiggyBankCard } from "@/features/hamm-contract/components/PiggyBankCard";
import PageLayout from "@/layout/PageLayout";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Container,
  Progress,
} from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { useRouter } from "next/router";

const useParams = () => {
  const router = useRouter();
  const { chainId, piggyBankId } = router.query;
  return {
    chainId: chainId !== undefined ? Number(chainId) : undefined,
    piggyBankId:
      piggyBankId !== undefined
        ? BigNumber.from(piggyBankId).toBigInt()
        : undefined,
  };
};

const UnsupportedChain = () => {
  return (
    <Alert
      status="error"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="200px"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        Unsupported chain
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        The piggy bank you are looking could be existing on a different chain.
      </AlertDescription>
    </Alert>
  );
};

const PiggyBankPageReady = () => {
  const { chainId, piggyBankId } = useParams();
  const chain = supportedChains.find((chain) => chain.id === chainId);
  if (chain === undefined) return <UnsupportedChain />;
  if (piggyBankId === undefined) return null;
  return (
    <Container marginTop={5}>
      <PiggyBankCard chain={chain} piggyBankId={piggyBankId} />
    </Container>
  );
};

const PiggyBankPage = () => {
  const router = useRouter();
  return (
    <PageLayout>
      {router.isReady ? (
        <PiggyBankPageReady />
      ) : (
        <Progress size="xs" isIndeterminate />
      )}
    </PageLayout>
  );
};

export default PiggyBankPage;
