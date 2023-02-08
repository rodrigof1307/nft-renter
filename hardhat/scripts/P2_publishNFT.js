// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
    // const accounts = await hre.ethers.getSigners();
    // console.log("Available Accounts:", accounts)
    // console.log("---")

    const RentHolder = await hre.ethers.getContractFactory("RentHolder");
    const rentHolder = await RentHolder.deploy('0x049c52922e5de3b0b26a7bcd2e565d52b540c7c9', 4,  ethers.utils.parseEther('0.05'), 20, 20, 1683475160, { value: ethers.utils.parseEther('0.05') });
    await rentHolder.deployed();
    console.log("RentHolder SC deployed to:", rentHolder.address);
    console.log("---")
    const nftContract = await ethers.getContractAt("ERC721", '0x049c52922e5de3b0b26a7bcd2e565d52b540c7c9')
    await nftContract.approve(rentHolder.address, 4)
    await rentHolder.transferNFT();
    console.log("NFT Transfered");
    console.log("---")

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
