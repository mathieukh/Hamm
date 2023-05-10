import { AddressPageContent } from "@/features/hamm-contract";
import PageLayout from "@/layout/PageLayout";
import { useRouter } from "next/router";
import { Address } from "wagmi";

const useParams = () => {
  const router = useRouter();
  return { address: router.query.address as Address };
};

const AddressPage = () => {
  const { address } = useParams();
  return (
    <PageLayout>
      <AddressPageContent address={address} />
    </PageLayout>
  );
};

export default AddressPage;
