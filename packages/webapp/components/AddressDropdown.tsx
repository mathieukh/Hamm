import { FC, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import {
  WalletIcon,
  ArrowLeftOnRectangleIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";
import { useCopyAddress, useTruncatedAddress } from "@/hooks";
import { useAddress, useDisconnect } from "@thirdweb-dev/react";
import Link from "next/link";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const AddressDropdown: FC = () => {
  const { truncatedAddress, address } = useTruncatedAddress();
  const disconnect = useDisconnect();
  const copyAddress = useCopyAddress();
  if (address === undefined) return null;
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm text-gray-700 font-semibold ring-1 ring-inset ring-gray-700/20 hover:bg-purple-300">
          {({ open }) => (
            <>
              {truncatedAddress}
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
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={`/address/${address}`}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "px-4 py-2 text-sm capitalize inline-flex w-full gap-x-3"
                  )}
                >
                  <WalletIcon
                    className="-mr-1 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  My wallets
                </Link>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={copyAddress}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "px-4 py-2 text-sm capitalize inline-flex w-full gap-x-3"
                  )}
                >
                  <ClipboardIcon
                    className="-mr-1 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  Copy address
                </a>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={disconnect}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "px-4 py-2 text-sm inline-flex w-full gap-x-3"
                  )}
                >
                  <ArrowLeftOnRectangleIcon
                    className="-mr-1 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  Disconnect
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
