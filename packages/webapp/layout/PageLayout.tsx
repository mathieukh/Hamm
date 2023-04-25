import { Header } from "@/components/Header";
import { FC, PropsWithChildren } from "react";

export const PageLayout: FC<PropsWithChildren> = ({ children }) => (
  <main className="container mx-auto">
    <Header />
    {children}
  </main>
);
