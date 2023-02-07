// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const RentHolder = await hre.ethers.getContractFactory("RentHolder");
  const rentHolder = await RentHolder.deploy('0x049c52922e5de3b0b26a7bcd2e565d52b540c7c9', 3,  ethers.utils.parseEther('0.03'), 10, 10, 1675812728, { value: ethers.utils.parseEther('0.05') });

  await rentHolder.deployed();

  console.log("RentHolder SC deployed to:", rentHolder.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
