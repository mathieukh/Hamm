import { Profile } from "./Profile";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] });

export const Header = () => (
  <nav className="flex items-center justify-between flex-wrap bg-purple-200 rounded-lg px-4 py-2 h-20">
    <span className={`text-2xl tracking-wider ${pacifico.className}`}>
      Hamm
    </span>
    <Profile />
  </nav>
);
