import { Header } from "@/components/Header";
import { FC, PropsWithChildren } from "react";
import { Box, Container } from "@chakra-ui/react";
import { Footer } from "@/components/Footer";

const PageLayout: FC<PropsWithChildren> = ({ children }) => (
  <Container
    maxW={"8xl"}
    pt={2}
    display={"flex"}
    flexDirection={"column"}
    h={"100vh"}
  >
    <Header flexShrink={1} />
    <Box flexGrow={1}>{children}</Box>
    <Footer flexShrink={1} />
  </Container>
);

export default PageLayout;
