import { ethers, network } from "hardhat";
import * as addresses from "../addresses.json";

const RENT_HOURS = 1;

async function rentNonCollateralized() {
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

  const nonCollateralizedRentHolderInfo = (await marketplaceTracker.listAllNonCollateralizedRelevantInfo())[0];

  const nonCollateralizedRentHolder = (
    await ethers.getContractAt("NonCollateralizedRentHolder", nonCollateralizedRentHolderInfo.rentHolderSC)
  ).connect(nftRenter);

  console.log("Performing Rent...");
  (
    await nonCollateralizedRentHolder.rent(1, {
      value: nonCollateralizedRentHolderInfo.ratePerHour.mul(RENT_HOURS),
    })
  ).wait(1);
  console.log("NFT Rented!");
}

rentNonCollateralized()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
