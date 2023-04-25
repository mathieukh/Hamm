import { Profile } from "./Profile";

export const Header = () => (
  <nav className="flex items-center justify-between flex-wrap p-6">
    <span className="font-semibold text-xl tracking-tight">Hamm</span>
    <Profile />
  </nav>
);
