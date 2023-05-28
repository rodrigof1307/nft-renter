import { ethers, network } from "hardhat";
import * as addresses from "../addresses.json";

const RENT_HOURS = 1;

async function rentCollateralized() {
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

  console.log("Performing Rent...");
  (
    await collateralizedRentHolder.rent(1, {
      value: collateralizedRentHolderInfo.ratePerHour.mul(RENT_HOURS).add(collateralizedRentHolderInfo.collateralValue),
    })
  ).wait(1);
  console.log("NFT Rented!");
}

rentCollateralized()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
