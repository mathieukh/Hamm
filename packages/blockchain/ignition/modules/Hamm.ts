import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import HammRendererV1 from "./HammRendererV1";

export default buildModule("Hamm", (m) => {
	const owner = m.getAccount(0);
	const { renderer } = m.useModule(HammRendererV1);
	const whitelist = m.getParameter("whitelist", []);
	const hamm = m.contract("Hamm", [owner, renderer, whitelist]);
	return { hamm };
});
