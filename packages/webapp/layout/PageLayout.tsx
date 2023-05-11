import { Header } from "@/components/Header";
import { FC, PropsWithChildren } from "react";
import { Container } from "@chakra-ui/react";

const PageLayout: FC<PropsWithChildren> = ({ children }) => (
  <Container maxW={"8xl"} pt={2}>
    <Header />
    {children}
  </Container>
);

export default PageLayout;
