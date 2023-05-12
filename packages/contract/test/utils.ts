import { BigNumber, utils } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const toBytes32 = (bn: BigNumber) => {
  return utils.hexlify(utils.zeroPad(bn.toHexString(), 32));
};

const setStorageAt = async (
  hre: HardhatRuntimeEnvironment,
  address: string,
  index: string,
  value: string
) => {
  await hre.ethers.provider.send("hardhat_setStorageAt", [
    address,
    index,
    value,
  ]);
  await hre.ethers.provider.send("evm_mine", []); // Just mines to the next block
};

export const changeBalanceForUser = async (
  hre: HardhatRuntimeEnvironment,
  tokenAddress: string,
  userAddress: string,
  locallyManipulatedBalance: BigNumber
) => {
  // Get storage slot index
  const index = hre.ethers.utils.solidityKeccak256(
    ["uint256", "uint256"],
    [userAddress, 0] // key, slot
  );
  // Manipulate local balance (needs to be bytes32 string)
  await setStorageAt(
    hre,
    tokenAddress,
    index.toString(),
    toBytes32(locallyManipulatedBalance).toString()
  );
};
