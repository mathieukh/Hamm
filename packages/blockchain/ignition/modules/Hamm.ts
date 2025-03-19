import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const HammModule = buildModule("Hamm", (m) => {
  const owner = m.getAccount(0);
  const renderer = m.contract("HammRendererV1");
  const whitelist = m.getParameter("whitelist", []);
  const hamm = m.contract("Hamm", [owner, renderer, whitelist]);
  return { hamm, renderer };
});

export default HammModule;
