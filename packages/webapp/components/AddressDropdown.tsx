import { FC } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  WalletIcon,
  ArrowLeftOnRectangleIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";
import { useCopyAddress, useTruncatedAddress } from "@/hooks";
import { useDisconnect } from "wagmi";
import Link from "next/link";

export const AddressDropdown: FC = () => {
  const { truncatedAddress, address } = useTruncatedAddress();
  const { disconnect } = useDisconnect();
  const copyAddress = useCopyAddress();
  if (address === undefined) return null;
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn gap-2 m-1">
        {truncatedAddress}
        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li className="gap-2">
          <Link href={`/address/${address}`}>
            <WalletIcon className="h-5 w-5" aria-hidden="true" />
            My Piggies
          </Link>
        </li>
        <li className="gap-2">
          <a onClick={() => copyAddress()}>
            <ClipboardIcon className="h-5 w-5" aria-hidden="true" />
            Copy address
          </a>
        </li>
        <li className="gap-2">
          <a onClick={() => disconnect()}>
            <ArrowLeftOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
            Disconnect
          </a>
        </li>
      </ul>
    </div>
  );
};
