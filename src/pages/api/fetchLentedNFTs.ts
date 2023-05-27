import { configureChains, sepolia, createConfig } from "@wagmi/core";
import { readContracts } from "@wagmi/core";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { Alchemy, Network } from "alchemy-sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";

const { publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [alchemyProvider({ apiKey: process.env.SEPOLIA_API_KEY ?? "" })]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

type Data = {
  lentedNFTs?: NFTInfo[];
  error?: string;
};

// To leverage wagmi type-inference I had to add the abi like this
const abi = [
  {
    inputs: [],
    name: "addCollateralizedRentHolderSC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "addNonCollateralizedRentHolderSC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "collateralizedRentHolderSCs",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "a",
        type: "string",
      },
      {
        internalType: "string",
        name: "b",
        type: "string",
      },
    ],
    name: "compareStrings",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "listAllCollateralizedRelevantInfo",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "rentHolderSC",
            type: "address",
          },
          {
            internalType: "address",
            name: "nftOwner",
            type: "address",
          },
          {
            internalType: "address",
            name: "nftAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "nftId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "ratePerHour",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "collateral",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "currRenter",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "currRentEndDate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "currRentPeriod",
            type: "uint256",
          },
        ],
        internalType: "struct IRentHolder.relevantRentInfo[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "listAllNonCollateralizedRelevantInfo",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "rentHolderSC",
            type: "address",
          },
          {
            internalType: "address",
            name: "nftOwner",
            type: "address",
          },
          {
            internalType: "address",
            name: "nftAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "nftId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "ratePerHour",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "collateral",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "currRenter",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "currRentEndDate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "currRentPeriod",
            type: "uint256",
          },
        ],
        internalType: "struct IRentHolder.relevantRentInfo[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "listAllRelevantInfo",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "rentHolderSC",
            type: "address",
          },
          {
            internalType: "address",
            name: "nftOwner",
            type: "address",
          },
          {
            internalType: "address",
            name: "nftAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "nftId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "ratePerHour",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "collateral",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "currRenter",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "currRentEndDate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "currRentPeriod",
            type: "uint256",
          },
        ],
        internalType: "struct IRentHolder.relevantRentInfo[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_lenter",
        type: "address",
      },
    ],
    name: "listLentedRelevantInfo",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "rentHolderSC",
            type: "address",
          },
          {
            internalType: "address",
            name: "nftOwner",
            type: "address",
          },
          {
            internalType: "address",
            name: "nftAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "nftId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "ratePerHour",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "collateral",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "currRenter",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "currRentEndDate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "currRentPeriod",
            type: "uint256",
          },
        ],
        internalType: "struct IRentHolder.relevantRentInfo[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_renter",
        type: "address",
      },
    ],
    name: "listRentedRelevantInfo",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "rentHolderSC",
            type: "address",
          },
          {
            internalType: "address",
            name: "nftOwner",
            type: "address",
          },
          {
            internalType: "address",
            name: "nftAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "nftId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "ratePerHour",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "collateral",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "currRenter",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "currRentEndDate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "currRentPeriod",
            type: "uint256",
          },
        ],
        internalType: "struct IRentHolder.relevantRentInfo[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "nonCollateralizedRentHolderSCs",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "removeCollateralizedRentSC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "removeNonCollateralizedRentSC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { address } = req.query;

  // For some reason, if the address is not passed it is a string with value "undefined" instead of undefined
  if (address === "undefined" || typeof address !== "string" || address.slice(0, 2) !== "0x") {
    return res.status(400).json({ error: "Invalid address" });
  }

  try {
    const [response] = await readContracts({
      contracts: [
        {
          address: "0x90dd4730A104e15c71ED9B82eb025AF801348860",
          abi,
          functionName: "listLentedRelevantInfo",
          args: [address as `0x${string}`],
        },
      ],
    });

    const rentHolderSCs = response.result ?? [];

    const config = {
      apiKey: process.env.SEPOLIA_API_KEY,
      network: Network.ETH_SEPOLIA,
    };

    const alchemy = new Alchemy(config);

    const promisesNFTMetadata = [];

    for (const rentHolderSC of rentHolderSCs) {
      promisesNFTMetadata.push(alchemy.nft.getNftMetadata(rentHolderSC.nftAddress, rentHolderSC.nftId.toString(), {}));
    }

    const responseNFTMetadata = await Promise.all(promisesNFTMetadata);

    const lentedNFTs = [] as NFTInfo[];

    for (let i = 0; i < responseNFTMetadata.length; i++) {
      lentedNFTs.push({
        rentSCAddress: rentHolderSCs[i].rentHolderSC,
        address: responseNFTMetadata[i].contract.address,
        collectionName: responseNFTMetadata[i].contract.name,
        tokenID: parseFloat(responseNFTMetadata[i].tokenId),
        title: responseNFTMetadata[i].title,
        description: responseNFTMetadata[i].description,
        image: responseNFTMetadata[i].rawMetadata?.image,
        attributes: responseNFTMetadata[i].rawMetadata?.attributes,
        tokenURI: responseNFTMetadata[i].tokenUri?.raw ?? "",
        rentRate: parseFloat(ethers.formatEther(rentHolderSCs[i].ratePerHour)),
        collateral: parseFloat(ethers.formatEther(rentHolderSCs[i].collateral)),
        expirationDate: (parseFloat(rentHolderSCs[i].currRentEndDate.toString()) * 1000).toString(),
        rentPeriod: parseFloat(rentHolderSCs[i].currRentPeriod.toString()),
      });
    }

    return res.status(200).json({
      lentedNFTs,
      error: "",
    });
  } catch (error) {
    console.error("Error fetching lented NFTs:", error);
    return res.status(500).json({ error: "Failed to fetch lented NFTs." });
  }
}
