// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// eslint-disable-next-line
const hre = require("hardhat");

async function main() {
  const WrappedNFT = await hre.ethers.getContractFactory("WrappedNFT");
  const wrappedNFT = await WrappedNFT.deploy();

  await wrappedNFT.deployed();

  console.log("Wrapped NFT deployed to:", wrappedNFT.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
