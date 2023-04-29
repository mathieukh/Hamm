import { Header } from "@/components/Header";
import { FC, PropsWithChildren } from "react";

const PageLayout: FC<PropsWithChildren> = ({ children }) => (
  <div className="container mx-auto p-4">
    <Header />
    {children}
  </div>
);

export default PageLayout;
