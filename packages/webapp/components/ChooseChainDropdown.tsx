import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  useActiveChain,
  MediaRenderer,
  useSwitchChain,
  useSupportedChains,
  useChainId,
  useConnectionStatus,
} from "@thirdweb-dev/react";
import { FC } from "react";
import { supportedChains } from "@/config";

const ChainAvatar: FC = () => {
  const connectedChainId = useChainId();
  const chain = useActiveChain();
  const supportedChains = useSupportedChains();
  if (connectedChainId === undefined) return null;
  const isSupportedChain = supportedChains.some(
    (supportedChain) => supportedChain.chainId === connectedChainId
  );
  if (!isSupportedChain)
    return <button className="text-red-600">Wrong network</button>;
  const { icon, name, chain: chainName } = chain!!;
  if (icon === undefined) return <>{name}</>;
  return (
    <MediaRenderer alt={chainName} src={icon.url} height="20px" width="20px" />
  );
};

export const ChooseChainDropdown: FC = () => {
  const status = useConnectionStatus();
  const switchChain = useSwitchChain();
  if (status !== "connected") return null;
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
        {supportedChains.map((supportedChain) => (
          <li key={supportedChain.chainId}>
            <a onClick={() => switchChain(supportedChain.chainId)}>
              {supportedChain.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
