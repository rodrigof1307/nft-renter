import { createConfig, configureChains, sepolia } from "@wagmi/core";
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
  collateralizedRentals?: NFTInfo[];
  nonCollateralizedRentals?: NFTInfo[];
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
  try {
    const [response] = await readContracts({
      contracts: [
        {
          address: "0x90dd4730A104e15c71ED9B82eb025AF801348860",
          abi,
          functionName: "listAllRelevantInfo",
        },
      ],
    });

    const rentHolderSCs = response.result ?? [];

    const rawRentHolderSCs = [];

    const currentDate = new Date().getTime() / 1000;

    for (const rentHolderSC of rentHolderSCs) {
      if (parseFloat(rentHolderSC.currRentEndDate.toString()) < currentDate) {
        rawRentHolderSCs.push(rentHolderSC);
      }
    }

    const config = {
      apiKey: process.env.SEPOLIA_API_KEY,
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
        rentSCAddress: rentHolderSCs[i].rentHolderSC,
        address: responseNFTMetadata[i].contract.address,
        collectionName: responseNFTMetadata[i].contract.name,
        tokenID: parseFloat(responseNFTMetadata[i].tokenId),
        title: responseNFTMetadata[i].title,
        description: responseNFTMetadata[i].description,
        image: responseNFTMetadata[i].rawMetadata?.image,
        attributes: responseNFTMetadata[i].rawMetadata?.attributes,
        tokenURI: responseNFTMetadata[i].tokenUri?.raw ?? "",
        rentRate: parseFloat(ethers.formatEther(rawRentHolderSCs[i].ratePerHour)),
        collateral: parseFloat(ethers.formatEther(rawRentHolderSCs[i].collateral)),
        expirationDate: (parseFloat(rentHolderSCs[i].currRentEndDate.toString()) * 1000).toString(),
        rentPeriod: parseFloat(rawRentHolderSCs[i].currRentPeriod.toString()),
      };

      if (parseFloat(ethers.formatEther(rawRentHolderSCs[i].collateral)) > 0) {
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
  } catch (error) {
    console.error("Error fetching marketplace NFTs:", error);
    return res.status(500).json({ error: "Failed to fetch marketplace NFTs." });
  }
}
