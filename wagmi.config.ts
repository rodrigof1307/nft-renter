import { defineConfig } from "@wagmi/cli";
import { hardhat } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "src/consts/abi.ts",
  plugins: [
    hardhat({
      project: "./",
    }),
  ],
});
