import { ethers } from "hardhat";

async function main() {
  const HammFactory = await ethers.getContractFactory("Hamm");
  const hamm = await HammFactory.deploy();
  await hamm.deployed();
  console.log(`Hamm contract deployed at the address: ${hamm.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
