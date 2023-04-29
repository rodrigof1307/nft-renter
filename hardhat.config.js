require("@nomicfoundation/hardhat-toolbox");
// eslint-disable-next-line
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: [process.env.PRIVATE_KEY_NFT_1, process.env.PRIVATE_KEY_NFT_2],
    },
  },
};
