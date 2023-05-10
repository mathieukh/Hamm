import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { abi } from "../contract/artifacts/contracts/Hamm.sol/Hamm.json";
import { Abi } from "abitype";

export default defineConfig({
  out: "lib/hamm.ts",
  contracts: [
    {
      name: "Hamm",
      abi: abi as Abi,
    },
  ],
  plugins: [react()],
});
