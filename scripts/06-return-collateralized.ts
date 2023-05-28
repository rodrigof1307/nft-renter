import { ethers, network } from "hardhat";
import * as addresses from "../addresses.json";

async function returnCollateralized() {
  const chainId = (network.config.chainId ?? 31337).toString();
  const availableChainIds = Object.keys(addresses);

  if (!availableChainIds.includes((network.config.chainId ?? -1).toString())) {
    return;
  }

  const nftRenter = (await ethers.getSigners())[1];

  console.log("Fetching info...");
  const marketplaceTracker = (
    await ethers.getContractAt("MarketplaceTracker", addresses[chainId as keyof typeof addresses]["MarketplaceTracker"])
  ).connect(nftRenter);

  const collateralizedRentHolderInfo = (await marketplaceTracker.listAllCollateralizedRelevantInfo())[0];

  const collateralizedRentHolder = (
    await ethers.getContractAt("CollateralizedRentHolder", collateralizedRentHolderInfo.rentHolderSC)
  ).connect(nftRenter);
  console.log("Approving Transfer...");
  const counterStrikeNFT = (
    await ethers.getContractAt("CounterStrikeNFT", collateralizedRentHolderInfo.nftAddress)
  ).connect(nftRenter);
  (await counterStrikeNFT.approve(collateralizedRentHolderInfo.rentHolderSC, collateralizedRentHolderInfo.nftId)).wait(
    1
  );
  console.log("Performing Return...");
  (await collateralizedRentHolder.returnNFT()).wait(1);
  console.log("NFT Returned!");
}

returnCollateralized()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
