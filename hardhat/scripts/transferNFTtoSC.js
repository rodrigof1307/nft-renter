// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const contract = await ethers.getContractAt("ERC721", '0x049c52922e5de3b0b26a7bcd2e565d52b540c7c9')
  const response  = await contract.transferFrom('0xA6f3778c0024AC3C82D8B678eA57AB7a278EEccb', '0x97da31015E165792C475E167Bcb20b84057C8F38', 3)
  console.log(response)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
