import { ethers, network } from "hardhat";
import * as addresses from "../addresses.json";

const MINT_PRICE = ethers.utils.parseEther("0.01");
const RATE_PER_HOUR = ethers.utils.parseEther("0.01");

async function mintAndList() {
  const chainId = (network.config.chainId ?? 31337).toString();
  const availableChainIds = Object.keys(addresses);

  if (!availableChainIds.includes((network.config.chainId ?? -1).toString())) {
    return;
  }

  const nftOwner = (await ethers.getSigners())[0];

  const counterStrikeNFT = (
    await ethers.getContractAt("CounterStrikeNFT", addresses[chainId as keyof typeof addresses]["CounterStrikeNFT"])
  ).connect(nftOwner);

  const marketplaceTracker = (
    await ethers.getContractAt("MarketplaceTracker", addresses[chainId as keyof typeof addresses]["MarketplaceTracker"])
  ).connect(nftOwner);

  const nonCollateralizedRentHolderFactory = (await ethers.getContractFactory("NonCollateralizedRentHolder")).connect(
    nftOwner
  );

  console.log("Minting NFT...");
  const mintTx = await counterStrikeNFT.payToMint(nftOwner.address, { value: MINT_PRICE });
  const mintTxReceipt = await mintTx.wait();
  const tokenId = mintTxReceipt?.events?.[0].args?.tokenId;
  console.log(`Minted NFT with tokenId ${tokenId}`);
  console.log("Deploying Rent Holder SC...");
  const nonCollateralizedRentHolder = await nonCollateralizedRentHolderFactory.deploy(
    counterStrikeNFT.address,
    tokenId,
    RATE_PER_HOUR,
    marketplaceTracker.address
  );
  nonCollateralizedRentHolder.deployed();
  console.log(`Deployed Rent Holder SC with address ${nonCollateralizedRentHolder.address}`);
  console.log("Approving NFT for Rent Holder SC...");
  (await counterStrikeNFT.approve(nonCollateralizedRentHolder.address, tokenId)).wait(1);
  console.log(`Approved NFT with tokenId ${tokenId} for Rent Holder SC`);
  console.log("Publishing NFT...");
  (await nonCollateralizedRentHolder.publishNFT()).wait(1);
  console.log(`Published NFT with tokenId ${tokenId}`);
}

mintAndList()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
