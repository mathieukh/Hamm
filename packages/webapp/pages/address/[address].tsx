import { AddressPageContent } from "@/features/hamm-contract";
import PageLayout from "@/layout/PageLayout";
import { useRouter } from "next/router";

const useParams = () => {
  const router = useRouter();
  return { address: router.query.address as string };
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
