import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("HammRendererV1", (m) => {
  const renderer = m.contract("HammRendererV1");
  return { renderer };
});
