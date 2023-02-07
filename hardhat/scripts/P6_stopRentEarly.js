// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const accounts = await hre.ethers.getSigners();

  const contract = await (await ethers.getContractAt("RentHolder", '0x1Ba819bb02CF7aF72Ea356E55547cd83d7E050a7')).connect(accounts[1])
  await contract.stopRentEarly()
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
