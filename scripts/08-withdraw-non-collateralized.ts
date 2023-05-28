import { ethers, network } from "hardhat";
import * as addresses from "../addresses.json";
import { moveTime } from "../utils/move-time";

async function withdrawNonCollateralized() {
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

  const nonCollateralizedRentHolderInfo = (await marketplaceTracker.listAllNonCollateralizedRelevantInfo())[0];

  const nonCollateralizedRentHolder = (
    await ethers.getContractAt("NonCollateralizedRentHolder", nonCollateralizedRentHolderInfo.rentHolderSC)
  ).connect(nftOwner);

  console.log("Moving Time...");
  moveTime(4000);

  console.log("Performing Withdrawal...");
  (await nonCollateralizedRentHolder.withdrawNFT()).wait(1);
  console.log("NFT Withdrawn!");
}

withdrawNonCollateralized()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
