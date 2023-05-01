require("@nomicfoundation/hardhat-toolbox");
// eslint-disable-next-line
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: [process.env.PRIVATE_KEY_NFT_1, process.env.PRIVATE_KEY_NFT_2],
    },
    sepolia: {
      url: process.env.SEPOLIA_URL,
      accounts: [process.env.PRIVATE_KEY_NFT_1, process.env.PRIVATE_KEY_NFT_2],
    },
  },
};
