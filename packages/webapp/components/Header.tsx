import Link from "next/link";
import { Profile } from "./Profile";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] });

export const Header = () => (
  <nav className="flex items-center justify-between flex-wrap bg-purple-200 rounded-lg px-4 py-2 h-20 ring-1 ring-inset ring-purple-300">
    <span className={`text-2xl tracking-wider ${pacifico.className}`}>
      <Link href="/">Hamm</Link>
    </span>
    <Profile />
  </nav>
);
