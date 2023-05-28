import { ethers, network } from "hardhat";
import * as addresses from "../addresses.json";

async function withdrawCollateralized() {
  const chainId = (network.config.chainId ?? 31337).toString();
  const availableChainIds = Object.keys(addresses);

  if (!availableChainIds.includes((network.config.chainId ?? -1).toString())) {
    return;
  }

  const nftOwner = (await ethers.getSigners())[0];

  console.log("Fetching info...");
  const marketplaceTracker = (
    await ethers.getContractAt("MarketplaceTracker", addresses[chainId as keyof typeof addresses]["MarketplaceTracker"])
  ).connect(nftOwner);

  const collateralizedRentHolderInfo = (await marketplaceTracker.listAllCollateralizedRelevantInfo())[0];

  const collateralizedRentHolder = (
    await ethers.getContractAt("CollateralizedRentHolder", collateralizedRentHolderInfo.rentHolderSC)
  ).connect(nftOwner);

  console.log("Performing Withdrawal...");
  (await collateralizedRentHolder.withdrawNFT()).wait(1);
  console.log("NFT Withdrawn!");
}

withdrawCollateralized()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
