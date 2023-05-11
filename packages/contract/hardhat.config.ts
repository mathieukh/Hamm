import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

task("deploy", "Deploy the Hamm contract")
  .addOptionalParam("tipReceiver", "The account's address to receive the tip")
  .setAction(async ({ tipReceiver }, hre) => {
    const [deployer] = await hre.ethers.getSigners();
    const HammFactory = await hre.ethers.getContractFactory("Hamm");
    const hamm = await HammFactory.deploy(tipReceiver ?? deployer.address);
    await hamm.deployed();
    console.log(`Hamm contract deployed at the address: ${hamm.address}`);
  });

const config: HardhatUserConfig = {
  solidity: "0.8.18",
};

export default config;
