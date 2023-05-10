import { Address } from "wagmi";

export const truncateAddress = (
  address: Address,
  {
    padFromStart = 6,
    padFromEnd = 4,
  }: { padFromStart?: number; padFromEnd?: number } = {}
) => address.slice(0, padFromStart) + "..." + address.slice(-padFromEnd);
