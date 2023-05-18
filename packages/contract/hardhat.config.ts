import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { changeBalanceForUser } from "./test/utils";

// Enables JSON serialization of BigInt type
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

task("deploy", "Deploy the Hamm contract")
  .addOptionalParam("tipReceiver", "The account's address to receive the tip")
  .setAction(async ({ tipReceiver }, hre) => {
    const [deployer] = await hre.ethers.getSigners();
    const HammFactory = await hre.ethers.getContractFactory("Hamm");
    const hamm = await HammFactory.deploy(tipReceiver ?? deployer.address);
    await hamm.deployed();
    console.log(`Hamm contract deployed at the address: ${hamm.address}`);
  });

task("deploy:token", "Deploy a fake token contract", async (_, hre) => {
  const [deployer] = await hre.ethers.getSigners();
  const amountToAdd = hre.ethers.utils.parseUnits("10.0", 18);
  const FakeERC20Factory = await hre.ethers.getContractFactory("ERC20");
  const token = await FakeERC20Factory.deploy("FakeToken", "FTK");
  await token.deployed();
  console.log(`Fake token contract deployed at the address: ${token.address}`);
  await changeBalanceForUser(hre, token.address, deployer.address, amountToAdd);
  const balance = await token.balanceOf(deployer.address);
  const formattedBalance = hre.ethers.utils.formatUnits(balance, 18);
  console.log(`User ${deployer.address} has ${formattedBalance} FTK`);
});

const config: HardhatUserConfig = {
  solidity: "0.8.18",
};

export default config;
