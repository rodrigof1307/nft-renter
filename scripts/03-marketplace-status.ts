import { ethers, network } from "hardhat";
import * as addresses from "../addresses.json";

async function marketplaceStatus() {
  const chainId = (network.config.chainId ?? 31337).toString();
  const availableChainIds = Object.keys(addresses);

  if (!availableChainIds.includes((network.config.chainId ?? -1).toString())) {
    return;
  }

  const nftOwner = (await ethers.getSigners())[0];

  const marketplaceTracker = (
    await ethers.getContractAt("MarketplaceTracker", addresses[chainId as keyof typeof addresses]["MarketplaceTracker"])
  ).connect(nftOwner);

  console.log("Checking Marketplace Status...");
  const relevantInfoList = await marketplaceTracker.listAllRelevantInfo();
  console.log(relevantInfoList);
  console.log("Marketplace Status Done!");
}

marketplaceStatus()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
