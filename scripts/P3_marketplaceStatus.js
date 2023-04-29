// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// eslint-disable-next-line
const hre = require("hardhat");

async function main() {
  const marketplace = await hre.ethers.getContractAt(
    "MarketplaceTracker",
    "0x753C915A00Dcb6358B059D2DecB9A1D5BD07D7b9"
  );
  const rentSCs = await marketplace.getCollateralizedRentRelevantInfo();
  console.log("Marketplace rentSCs:", rentSCs);
  console.log("---");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
