// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// eslint-disable-next-line
const hre = require("hardhat");
// eslint-disable-next-line
const { ethers } = require("hardhat");

async function main() {
  const contract = await ethers.getContractAt("CollateralizedRentHolder", "0xaAFeb2331fD01Da16ea4c64a0c94173875c855E0");
  const response = await contract.withdrawNFT();

  console.log(response);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
