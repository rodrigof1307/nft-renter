import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { readFileSync, writeFileSync } from "fs";
import { addressesFilePath } from "../helper-hardhat-config";

const saveAddresses: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, network } = hre;
  const { log } = deployments;

  log("----------------------------------------------------");
  log("Saving addresses to file...");
  const counterStrikeNFT = await deployments.get("CounterStrikeNFT");
  const wrappedNFT = await deployments.get("WrappedNFT");
  const marketplaceTracker = await deployments.get("MarketplaceTracker");
  const chainId = (network.config.chainId ?? 31337).toString();
  const contractAddresses = JSON.parse(readFileSync(addressesFilePath, "utf8"));
  if (chainId in contractAddresses) {
    contractAddresses[chainId]["CounterStrikeNFT"] = counterStrikeNFT.address;
    contractAddresses[chainId]["WrappedNFT"] = wrappedNFT.address;
    contractAddresses[chainId]["MarketplaceTracker"] = marketplaceTracker.address;
  } else {
    contractAddresses[chainId] = {
      CounterStrikeNFT: counterStrikeNFT.address,
      WrappedNFT: wrappedNFT.address,
      MarketplaceTracker: marketplaceTracker.address,
    };
  }
  writeFileSync(addressesFilePath, JSON.stringify(contractAddresses));
  log("Saved addresses to file.");
  log("----------------------------------------------------");
};
export default saveAddresses;
saveAddresses.tags = ["all", "saveAddresses"];
