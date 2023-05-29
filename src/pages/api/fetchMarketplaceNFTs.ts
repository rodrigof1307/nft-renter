import { createClient, configureChains, readContract } from "@wagmi/core";
import { hardhat, sepolia } from "viem/chains";
import { publicProvider } from "@wagmi/core/providers/public";
import { erc721ABI } from "wagmi";
import { Alchemy, Network } from "alchemy-sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import axios from "axios";
import { marketplaceTrackerABI } from "@/consts";
import * as addresses from "@/../addresses.json";

const { provider, webSocketProvider } = configureChains([sepolia, hardhat], [publicProvider()]);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

type Data = {
  collateralizedRentals?: NFTInfo[];
  nonCollateralizedRentals?: NFTInfo[];
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { chainID } = req.query;

  // For some reason, if the chainID is not passed it is a string with value "undefined" instead of undefined
  if (chainID === "undefined" || typeof chainID !== "string") {
    return res.status(400).json({ error: "Invalid chainID" });
  }

  try {
    const rentHolderSCs = await readContract({
      address: addresses[chainID as keyof typeof addresses]["MarketplaceTracker"] as `0x${string}`,
      abi: marketplaceTrackerABI,
      functionName: "listAllRelevantInfo",
      chainId: parseFloat(chainID),
    });

    const rawRentHolderSCs = [];

    const currentDate = new Date().getTime() / 1000;

    for (const rentHolderSC of rentHolderSCs) {
      if (rentHolderSC.currRentEndDate.toNumber() < currentDate) {
        rawRentHolderSCs.push(rentHolderSC);
      }
    }

    if (chainID === "11155111") {
      const config = {
        apiKey: process.env.NEXT_PUBLIC_SEPOLIA_API_KEY,
        network: Network.ETH_SEPOLIA,
      };

      const alchemy = new Alchemy(config);

      const promisesNFTMetadata = [];

      for (const rawRentHolderSC of rawRentHolderSCs) {
        promisesNFTMetadata.push(
          alchemy.nft.getNftMetadata(rawRentHolderSC.nftAddress, rawRentHolderSC.nftId.toString(), {})
        );
      }

      const responseNFTMetadata = await Promise.all(promisesNFTMetadata);

      const collateralizedRentals = [] as NFTInfo[];
      const nonCollateralizedRentals = [] as NFTInfo[];

      for (let i = 0; i < responseNFTMetadata.length; i++) {
        const filteredItem = {
          rentSCAddress: rawRentHolderSCs[i].rentHolderSC,
          address: responseNFTMetadata[i].contract.address,
          collectionName: responseNFTMetadata[i].contract.name,
          tokenID: parseFloat(responseNFTMetadata[i].tokenId),
          title: responseNFTMetadata[i].title,
          description: responseNFTMetadata[i].description,
          image: responseNFTMetadata[i].rawMetadata?.image,
          attributes: responseNFTMetadata[i].rawMetadata?.attributes,
          tokenURI: responseNFTMetadata[i].tokenUri?.raw ?? "",
          rentRate: parseFloat(ethers.utils.formatEther(rawRentHolderSCs[i].ratePerHour)),
          collateral: parseFloat(ethers.utils.formatEther(rawRentHolderSCs[i].collateralValue)),
          expirationDate: (parseFloat(rawRentHolderSCs[i].currRentEndDate.toString()) * 1000).toString(),
          rentPeriod: rawRentHolderSCs[i].currRentPeriod.toNumber(),
        };

        if (parseFloat(ethers.utils.formatEther(rawRentHolderSCs[i].collateralValue)) > 0) {
          collateralizedRentals.push(filteredItem);
        } else {
          nonCollateralizedRentals.push(filteredItem);
        }
      }

      return res.status(200).json({
        collateralizedRentals,
        nonCollateralizedRentals,
        error: "",
      });
    } else {
      const promisesNFTMetadata = [];

      for (const rentHolderSC of rawRentHolderSCs) {
        promisesNFTMetadata.push(
          readContract({
            address: rentHolderSC.nftAddress,
            abi: erc721ABI,
            functionName: "tokenURI",
            args: [rentHolderSC.nftId],
            chainId: parseFloat(chainID),
          })
        );
      }

      const responseNFTMetadata = await Promise.all(promisesNFTMetadata);

      const collateralizedRentals = [] as NFTInfo[];
      const nonCollateralizedRentals = [] as NFTInfo[];

      for (let i = 0; i < responseNFTMetadata.length; i++) {
        const metadata = (await axios.get(responseNFTMetadata[i].replace("ipfs://", "https://ipfs.io/ipfs/"))).data;
        const filteredItem = {
          rentSCAddress: rawRentHolderSCs[i].rentHolderSC,
          address: rawRentHolderSCs[i].nftAddress,
          collectionName: "",
          tokenID: rawRentHolderSCs[i].nftId.toNumber(),
          title: metadata.name,
          description: metadata.description,
          image: metadata.image,
          attributes: metadata.attributes,
          tokenURI: responseNFTMetadata[i],
          rentRate: parseFloat(ethers.utils.formatEther(rawRentHolderSCs[i].ratePerHour)),
          collateral: parseFloat(ethers.utils.formatEther(rawRentHolderSCs[i].collateralValue ?? 0)),
          expirationDate: (parseFloat(rawRentHolderSCs[i].currRentEndDate.toString()) * 1000).toString(),
          rentPeriod: rawRentHolderSCs[i].currRentPeriod.toNumber(),
        };

        if (parseFloat(ethers.utils.formatEther(rawRentHolderSCs[i].collateralValue ?? 0)) > 0) {
          collateralizedRentals.push(filteredItem);
        } else {
          nonCollateralizedRentals.push(filteredItem);
        }
      }

      return res.status(200).json({
        collateralizedRentals,
        nonCollateralizedRentals,
        error: "",
      });
    }
  } catch (error) {
    console.error("Error fetching marketplace NFTs:", error);
    return res.status(500).json({ error: "Failed to fetch marketplace NFTs." });
  }
}
