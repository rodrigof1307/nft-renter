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
  const accounts = await hre.ethers.getSigners();

  const contract = await (
    await ethers.getContractAt("CollateralizedRentHolder", "0xb90616E3a7d8e0c9626d52Ea6b4df3Fef3BAF43D")
  ).connect(accounts[1]);
  const response = await contract.rent(2, { value: ethers.parseEther("0.12") });
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
