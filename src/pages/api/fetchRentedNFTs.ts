import { createClient, configureChains, readContract } from "@wagmi/core";
import { hardhat, sepolia } from "viem/chains";
import { publicProvider } from "@wagmi/core/providers/public";
import { erc721ABI } from "wagmi";
import { Alchemy, Network } from "alchemy-sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { marketplaceTrackerABI } from "@/consts";
import * as addresses from "@/../addresses.json";
import axios from "axios";

const { provider, webSocketProvider } = configureChains([sepolia, hardhat], [publicProvider()]);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

type Data = {
  rentedNFTs?: NFTInfo[];
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { address, chainID } = req.query;

  // For some reason, if the address is not passed it is a string with value "undefined" instead of undefined
  if (address === "undefined" || typeof address !== "string" || address.slice(0, 2) !== "0x") {
    return res.status(400).json({ error: "Invalid address" });
  }

  // For some reason, if the chainID is not passed it is a string with value "undefined" instead of undefined
  if (chainID === "undefined" || typeof chainID !== "string") {
    return res.status(400).json({ error: "Invalid chainID" });
  }

  try {
    const rentHolderSCs = await readContract({
      address: addresses[chainID as keyof typeof addresses]["MarketplaceTracker"] as `0x${string}`,
      abi: marketplaceTrackerABI,
      functionName: "listRentedRelevantInfo",
      args: [address as `0x${string}`],
      chainId: parseFloat(chainID),
    });

    if (chainID === "11155111") {
      const promisesNFTMetadata = [];
      const config = {
        apiKey: process.env.NEXT_PUBLIC_SEPOLIA_API_KEY,
        network: Network.ETH_SEPOLIA,
      };

      const alchemy = new Alchemy(config);

      for (const rentHolderSC of rentHolderSCs) {
        promisesNFTMetadata.push(
          alchemy.nft.getNftMetadata(rentHolderSC.nftAddress, rentHolderSC.nftId.toString(), {})
        );
      }

      const responseNFTMetadata = await Promise.all(promisesNFTMetadata);
      const rentedNFTs = [] as NFTInfo[];

      for (let i = 0; i < responseNFTMetadata.length; i++) {
        rentedNFTs.push({
          rentSCAddress: rentHolderSCs[i].rentHolderSC,
          address: responseNFTMetadata[i].contract.address,
          collectionName: responseNFTMetadata[i].contract.name,
          tokenID: parseFloat(responseNFTMetadata[i].tokenId),
          title: responseNFTMetadata[i].title,
          description: responseNFTMetadata[i].description,
          image: responseNFTMetadata[i].rawMetadata?.image,
          attributes: responseNFTMetadata[i].rawMetadata?.attributes,
          tokenURI: responseNFTMetadata[i].tokenUri?.raw ?? "",
          rentRate: parseFloat(ethers.utils.formatEther(rentHolderSCs[i].ratePerHour)),
          collateral: parseFloat(ethers.utils.formatEther(rentHolderSCs[i].collateralValue)),
          expirationDate: (parseFloat(rentHolderSCs[i].currRentEndDate.toString()) * 1000).toString(),
          rentPeriod: rentHolderSCs[i].currRentPeriod.toNumber(),
        });
      }

      return res.status(200).json({
        rentedNFTs,
        error: "",
      });
    } else {
      const promisesNFTMetadata = [];

      for (const rentHolderSC of rentHolderSCs) {
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

      const rentedNFTs = [] as NFTInfo[];

      for (let i = 0; i < responseNFTMetadata.length; i++) {
        const metadata = (await axios.get(responseNFTMetadata[i].replace("ipfs://", "https://ipfs.io/ipfs/"))).data;
        rentedNFTs.push({
          rentSCAddress: rentHolderSCs[i].rentHolderSC,
          address: rentHolderSCs[i].nftAddress,
          collectionName: "",
          tokenID: rentHolderSCs[i].nftId.toNumber(),
          title: metadata.name,
          description: metadata.description,
          image: metadata.image,
          attributes: metadata.attributes,
          tokenURI: responseNFTMetadata[i],
          rentRate: parseFloat(ethers.utils.formatEther(rentHolderSCs[i].ratePerHour)),
          collateral: parseFloat(ethers.utils.formatEther(rentHolderSCs[i].collateralValue ?? 0)),
          expirationDate: (parseFloat(rentHolderSCs[i].currRentEndDate.toString()) * 1000).toString(),
          rentPeriod: rentHolderSCs[i].currRentPeriod.toNumber(),
        });
      }

      return res.status(200).json({
        rentedNFTs,
        error: "",
      });
    }
  } catch (error) {
    console.error("Error fetching rented NFTs:", error);
    return res.status(500).json({ error: "Failed to fetch rented NFTs." });
  }
}
