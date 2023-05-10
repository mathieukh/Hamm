import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { FC } from "react";
import { supportedChains } from "@/config";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";

const ChainAvatar: FC = () => {
  const { chain } = useNetwork();
  if (chain === undefined) return null;
  if (chain.unsupported)
    return <button className="text-red-600">Wrong network</button>;
  const { name } = chain;
  return <>{name}</>;
};

export const ChooseChainDropdown: FC = () => {
  const { isConnected } = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  if (!isConnected) return null;
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn gap-2 m-1">
        <ChainAvatar />
        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        {supportedChains.map(({ id, name }) => (
          <li key={id}>
            <a onClick={() => switchNetwork?.(id)}>{name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};
