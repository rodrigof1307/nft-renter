import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { addressesFilePath, contractsInfoFilePath } from "../helper-hardhat-config";

const saveInfo: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
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

    if (chainId === "31337") {
      contractAddresses["1337"]["CounterStrikeNFT"] = counterStrikeNFT.address;
      contractAddresses["1337"]["WrappedNFT"] = wrappedNFT.address;
      contractAddresses["1337"]["MarketplaceTracker"] = marketplaceTracker.address;
    }
  } else {
    contractAddresses[chainId] = {
      CounterStrikeNFT: counterStrikeNFT.address,
      WrappedNFT: wrappedNFT.address,
      MarketplaceTracker: marketplaceTracker.address,
    };

    if (chainId === "31337") {
      contractAddresses["1337"] = {
        CounterStrikeNFT: counterStrikeNFT.address,
        WrappedNFT: wrappedNFT.address,
        MarketplaceTracker: marketplaceTracker.address,
      };
    }
  }
  writeFileSync(addressesFilePath, JSON.stringify(contractAddresses));
  log("Saved addresses to file.");

  log("Saving info to file...");
  const collateralizedRentHolderPath = path.resolve(
    __dirname,
    "../artifacts/contracts/CollateralizedRentHolder.sol/CollateralizedRentHolder.json"
  );
  const nonCollateralizedRentHolderPath = path.resolve(
    __dirname,
    "../artifacts/contracts/NonCollateralizedRentHolder.sol/NonCollateralizedRentHolder.json"
  );
  const marketplaceTrackerPath = path.resolve(
    __dirname,
    "../artifacts/contracts/MarketplaceTracker.sol/MarketplaceTracker.json"
  );
  const collateralizedRentHolderInfo = JSON.parse(readFileSync(collateralizedRentHolderPath, "utf8"));
  const nonCollateralizedRentHolderInfo = JSON.parse(readFileSync(nonCollateralizedRentHolderPath, "utf8"));
  const marketplaceTrackerInfo = JSON.parse(readFileSync(marketplaceTrackerPath, "utf8"));
  writeFileSync(
    `${contractsInfoFilePath}collateralizedRentHolder.json`,
    JSON.stringify({ bytecode: collateralizedRentHolderInfo.bytecode })
  );
  writeFileSync(
    `${contractsInfoFilePath}nonCollateralizedRentHolder.json`,
    JSON.stringify({ bytecode: nonCollateralizedRentHolderInfo.bytecode })
  );
  writeFileSync(
    `${contractsInfoFilePath}marketplaceTracker.json`,
    JSON.stringify({ bytecode: marketplaceTrackerInfo.bytecode })
  );
  log("Saved info to file.");
  log("----------------------------------------------------");
};
export default saveInfo;
saveInfo.tags = ["all", "saveInfo"];
