import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../helper-hardhat-config";
import { ethers } from "hardhat";

const VALUE = ethers.utils.parseEther("100");

const transferBalances: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, network } = hre;
  const { log } = deployments;
  const transferAccount = (await ethers.getSigners())[2];

  if (!developmentChains.includes(network.name)) {
    return;
  }

  log("----------------------------------------------------");
  log("Transferring 100 ETH to accounts");
  [
    "0x1Cd5956d6BDb1692e92113A3F2130435333e178D",
    "0x65D9FC9BfB33934A3c118889BC5CCB86262C64d7",
    "0xB644206E908486c2A0eB547375C612A4BD3A2DCc",
    "0x5f2f18d860896916DE68b138645b711d73a3D80B",
    "0xA6f3778c0024AC3C82D8B678eA57AB7a278EEccb",
  ].forEach(async (address) => {
    await (
      await transferAccount.sendTransaction({
        to: address,
        value: VALUE,
      })
    ).wait(1);
  });
  log("Transferred 100 ETH to accounts");
  log("----------------------------------------------------");
};
export default transferBalances;
transferBalances.tags = ["all", "transferBalances"];
