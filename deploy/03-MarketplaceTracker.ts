import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } from "../helper-hardhat-config";
import verify from "../utils/verify";

const deployMarketplaceTracker: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const waitBlockConfirmations = developmentChains.includes(network.name) ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS;

  const wrappedNFT = await deployments.get("WrappedNFT");

  log("----------------------------------------------------");
  const args: any[] = [1, wrappedNFT.address];
  const marketplaceTracker = await deploy("MarketplaceTracker", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: waitBlockConfirmations,
  });

  // Verify the deployment
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("Verifying...");
    await verify(marketplaceTracker.address, args);
  }

  log("----------------------------------------------------");
};
export default deployMarketplaceTracker;
deployMarketplaceTracker.tags = ["all", "marketplaceTracker"];
