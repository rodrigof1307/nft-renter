import { ethers, network } from "hardhat";
import * as addresses from "../addresses.json";
import { moveTime } from "../utils/move-time";

async function claimCollateralized() {
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

  console.log("Moving Time...");
  moveTime(4000);

  console.log("Performing Collateral Claim...");
  (await collateralizedRentHolder.claimCollateral()).wait(1);
  console.log("Collateral Claimmed!");
}

claimCollateralized()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
