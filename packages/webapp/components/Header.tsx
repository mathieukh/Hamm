import Link from "next/link";
import { Profile } from "./Profile";
import { Pacifico } from "next/font/google";

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] });

export const Header = () => (
  <div className="navbar bg-base-100">
    <div className="flex-1">
      <Link
        href="/"
        className={`btn btn-ghost normal-case text-3xl ${pacifico.className}`}
      >
        Hamm
      </Link>
    </div>
    <Profile />
  </div>
);
