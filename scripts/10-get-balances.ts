import { ethers, network } from "hardhat";
import * as addresses from "../addresses.json";

async function getBalances() {
  const availableChainIds = Object.keys(addresses);

  if (!availableChainIds.includes((network.config.chainId ?? -1).toString())) {
    return;
  }

  const nftOwner = (await ethers.getSigners())[0];
  const nftRenter = (await ethers.getSigners())[1];

  console.log("NFT Owner Balance ", (await nftOwner.getBalance()).toString());
  console.log("NFT Renter Balance ", (await nftRenter.getBalance()).toString());
}

getBalances()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
