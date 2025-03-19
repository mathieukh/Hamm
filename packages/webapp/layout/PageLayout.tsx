import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Box, Container } from "@chakra-ui/react";
import type { FC, PropsWithChildren } from "react";

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
