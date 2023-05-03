import { Menu, Transition } from "@headlessui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  useActiveChain,
  MediaRenderer,
  useSwitchChain,
  useSupportedChains,
  useChainId,
  useConnectionStatus,
} from "@thirdweb-dev/react";
import { FC, Fragment } from "react";
import { supportedChains } from "@/config";
import { classNames } from "@/utils/classNames";

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
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm text-gray-700 font-semibold ring-1 ring-inset ring-gray-700/20 bg-white hover:bg-gray-100">
          {({ open }) => (
            <>
              <ChainAvatar />
              {open ? (
                <ChevronUpIcon
                  className="-mr-1 h-5 w-5 text-gray-600"
                  aria-hidden="true"
                />
              ) : (
                <ChevronDownIcon
                  className="-mr-1 h-5 w-5 text-gray-600"
                  aria-hidden="true"
                />
              )}
            </>
          )}
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {supportedChains.map((supportedChain) => {
              return (
                <Menu.Item key={supportedChain.chainId}>
                  {({ active }) => (
                    <a
                      onClick={() => switchChain(supportedChain.chainId)}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "px-4 py-2 text-sm capitalize inline-flex w-full gap-x-3"
                      )}
                    >
                      {supportedChain.name}
                    </a>
                  )}
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
