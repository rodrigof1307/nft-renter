// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
    const marketplace = await hre.ethers.getContractAt("MarketplaceTracker", '0xC6166805035cAF58523F2e62A6E8d9469Ef70064');
    const rentSCs = await marketplace.getRentSCs();
    console.log("Marketplace rentSCs:", rentSCs)
    console.log("---")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});
