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
  // const accounts = await hre.ethers.getSigners();
  // console.log("Available Accounts:", accounts)
  // console.log("---")

  const CollateralizedRentHolder = await hre.ethers.getContractFactory("CollateralizedRentHolder");
  const collateralizedRentHolder = await CollateralizedRentHolder.deploy(
    "0xAdcADdC64E5a4B3E1358dBc85f0E2699226f2c04",
    0,
    ethers.utils.parseEther("0.01"),
    ethers.utils.parseEther("0.1")
  );
  await collateralizedRentHolder.deployed();
  console.log("RentHolder SC deployed to:", collateralizedRentHolder.address);
  console.log("---");
  const nftContract = await ethers.getContractAt("ERC721", "0xAdcADdC64E5a4B3E1358dBc85f0E2699226f2c04");
  await nftContract.approve(collateralizedRentHolder.address, 0);
  await collateralizedRentHolder.publishNFT();
  console.log("NFT Transfered");
  console.log("---");

  // const rentHolder = await hre.ethers.getContractAt("RentHolder", '0x04d99f9364b304A49735d2bEbbB4f5D07AC6dff4');
  // const response = await rentHolder.withdrawNFT({ gasLimit: 1000000 });
  // console.log(response)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
