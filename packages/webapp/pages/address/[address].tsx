import { AddressPageContent } from "@/features/hamm-contract";
import PageLayout from "@/layout/PageLayout";
import { useRouter } from "next/router";
import Head from "next/head";
import { Address } from "wagmi";

const useParams = () => {
  const router = useRouter();
  return { address: router.query.address as Address };
};

const AddressPage = () => {
  const { address } = useParams();
  return (
    <PageLayout>
      <Head>
        <title>Hamm - Address {address}</title>
      </Head>
      <AddressPageContent address={address} />
    </PageLayout>
  );
};

export default AddressPage;
