import PageLayout from "@/layout/PageLayout";
import { useRouter } from "next/router";

const AddressPage = () => {
  const router = useRouter();
  return <PageLayout>Address: {router.query.address}</PageLayout>;
};

export default AddressPage;
