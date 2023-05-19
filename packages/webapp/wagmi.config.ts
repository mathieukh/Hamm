import { defineConfig } from "@wagmi/cli";
import { react, hardhat } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "lib/hamm.ts",
  plugins: [
    react(),
    hardhat({
      project: "../contract",
    }),
  ],
});
