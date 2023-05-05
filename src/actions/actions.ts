import { QueryClient } from "react-query";
import { createWalletClient, custom, http, createPublicClient } from "viem";
import { sepolia } from "viem/chains";
import { ethers } from "ethers";
import { erc721ABI } from "wagmi";
import CollateralizedRentHolderArtifact from "../consts/CollateralizedRentHolderArtifact.json";
import NonCollateralizedRentHolderArtifact from "../consts/NonCollateralizedRentHolderArtifact.json";
import { Ethereum } from "@wagmi/core";

const collateralizedRentHolderSCAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_nftAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_nftID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_ratePerHour",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_collateralValue",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newRatePerHour",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_newCollateralValue",
        type: "uint256",
      },
    ],
    name: "changeRentalValues",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimCollateral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "collateralValue",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currRentEndDate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currRentPeriod",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currRenter",
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
    name: "feeCollector",
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
    name: "feePercentage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentNFTOwner",
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
    name: "nftAddress",
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
    name: "nftId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nftOwner",
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
    name: "publishNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "ratePerHour",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_hours",
        type: "uint8",
      },
    ],
    name: "rent",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "returnNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "returnRentInfo",
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
            name: "collateralValue",
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
            internalType: "uint8",
            name: "currRentPeriod",
            type: "uint8",
          },
        ],
        internalType: "struct CollateralizedRentHolder.relevantRentInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const nonCollateralizedRentHolderSCAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_nftAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_nftID",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_ratePerHour",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newRatePerHour",
        type: "uint256",
      },
    ],
    name: "changeRentalValues",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "currRentEndDate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currRentPeriod",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currRenter",
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
    name: "feeCollector",
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
    name: "feePercentage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nftAddress",
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
    name: "nftId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nftOwner",
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
    name: "publishNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "ratePerHour",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_hours",
        type: "uint8",
      },
    ],
    name: "rent",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "returnCurrRenterInfo",
    outputs: [
      {
        components: [
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
        ],
        internalType: "struct NonCollateralizedRentHolder.currRenterInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "returnRentInfo",
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
            name: "collateralValue",
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
            internalType: "uint8",
            name: "currRentPeriod",
            type: "uint8",
          },
        ],
        internalType: "struct NonCollateralizedRentHolder.relevantRentInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const settingUpClientsAndAccount = async (ethereum: Ethereum) => {
  const walletClient = createWalletClient({
    chain: sepolia,
    transport: custom(ethereum),
  });

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
  });

  const [account] = await walletClient.getAddresses();

  return { walletClient, publicClient, account };
};

const invalidateQueries = (queryClient: QueryClient) => {
  setTimeout(() => {
    queryClient.invalidateQueries(["ownedNFTs"]);
    queryClient.invalidateQueries(["lentedNFTs"]);
    queryClient.invalidateQueries(["rentedNFTs"]);
    queryClient.invalidateQueries(["marketplaceNFTs"]);
  }, 5000);
};

const performCollateralizedRentPublish = async (
  setButtonText: (text: string) => void,
  NFT: NFTInfo,
  rentRate: string,
  collateral: string,
  queryClient: QueryClient
) => {
  performRentPublish(setButtonText, queryClient, NFT, rentRate, collateral);
};

const performNonCollateralizedRentPublish = async (
  setButtonText: (text: string) => void,
  NFT: NFTInfo,
  rentRate: string,
  queryClient: QueryClient
) => {
  performRentPublish(setButtonText, queryClient, NFT, rentRate);
};

const performRentPublish = async (
  setButtonText: (text: string) => void,
  queryClient: QueryClient,
  NFT: NFTInfo,
  rentRate: string,
  collateral?: string
) => {
  if (!window.ethereum) return;

  setButtonText("DEPLOYING...");

  const { walletClient, publicClient, account } = await settingUpClientsAndAccount(window.ethereum);

  const hashDeployment = await (collateral
    ? walletClient.deployContract({
        abi: collateralizedRentHolderSCAbi,
        account,
        args: [
          NFT.address as `0x${string}`,
          BigInt(NFT.tokenID),
          BigInt(ethers.utils.parseEther(rentRate).toString()),
          BigInt(ethers.utils.parseEther(collateral).toString()),
        ],
        bytecode: CollateralizedRentHolderArtifact.bytecode as `0x${string}`,
      })
    : walletClient.deployContract({
        abi: nonCollateralizedRentHolderSCAbi,
        account,
        args: [NFT.address as `0x${string}`, BigInt(NFT.tokenID), BigInt(ethers.utils.parseEther(rentRate).toString())],
        bytecode: NonCollateralizedRentHolderArtifact.bytecode as `0x${string}`,
      }));

  const { contractAddress } = await publicClient.waitForTransactionReceipt({ hash: hashDeployment });

  if (!contractAddress) return;

  setButtonText("APPROVING TRANSFER...");

  const hashApproval = await walletClient.writeContract({
    account,
    address: NFT.address as `0x${string}`,
    abi: erc721ABI,
    functionName: "approve",
    args: [contractAddress, BigInt(NFT.tokenID)],
    value: BigInt(0),
  });

  await publicClient.waitForTransactionReceipt({ hash: hashApproval });

  setButtonText("PUBLISHING...");

  const hashPublish = await (collateral
    ? walletClient.writeContract({
        account,
        address: contractAddress as `0x${string}`,
        abi: collateralizedRentHolderSCAbi,
        functionName: "publishNFT",
      })
    : walletClient.writeContract({
        account,
        address: contractAddress as `0x${string}`,
        abi: nonCollateralizedRentHolderSCAbi,
        functionName: "publishNFT",
      }));

  await publicClient.waitForTransactionReceipt({ hash: hashPublish });

  setButtonText("DONE!");

  invalidateQueries(queryClient);
};

// This function is to allow the original NFT owner to remove the NFT from the marketplace
// There are two options two remove from the marketplace:
// - withdraw the NFT from the contract
// - if the NFT as never been returned, the collateral can be claimed
const performMarketplaceRemoval = async (
  setButtonText: (text: string) => void,
  NFT: NFTInfo,
  queryClient: QueryClient,
  mode: "withdrawNFT" | "claimCollateral"
) => {
  if (!window.ethereum) return;

  const { walletClient, publicClient, account } = await settingUpClientsAndAccount(window.ethereum);

  setButtonText("LOADING...");

  const hashWithdraw = await (NFT.collateral
    ? walletClient.writeContract({
        account,
        address: NFT.rentSCAddress as `0x${string}`,
        abi: collateralizedRentHolderSCAbi,
        functionName: mode,
      })
    : walletClient.writeContract({
        account,
        address: NFT.rentSCAddress as `0x${string}`,
        abi: nonCollateralizedRentHolderSCAbi,
        functionName: "withdrawNFT",
      }));

  await publicClient.waitForTransactionReceipt({ hash: hashWithdraw });

  setButtonText("DONE!");

  invalidateQueries(queryClient);
};

// This function is used to withdraw the NFT from the contract
const performWithdrawNFT = async (setButtonText: (text: string) => void, NFT: NFTInfo, queryClient: QueryClient) => {
  performMarketplaceRemoval(setButtonText, NFT, queryClient, "withdrawNFT");
};

// This function is used to claim the NFT collateral from the contract
const performClaimCollateral = async (
  setButtonText: (text: string) => void,
  NFT: NFTInfo,
  queryClient: QueryClient
) => {
  performMarketplaceRemoval(setButtonText, NFT, queryClient, "claimCollateral");
};

// This function is used to return the NFT to the rent smart contract
const performReturn = async (setButtonText: (text: string) => void, NFT: NFTInfo, queryClient: QueryClient) => {
  if (!window.ethereum) return;

  setButtonText("APPROVING TRANSFER...");

  const { walletClient, publicClient, account } = await settingUpClientsAndAccount(window.ethereum);

  const hashApproval = await walletClient.writeContract({
    account,
    address: NFT.address as `0x${string}`,
    abi: erc721ABI,
    functionName: "approve",
    args: [NFT.rentSCAddress as `0x${string}`, BigInt(NFT.tokenID)],
    value: BigInt(0),
  });

  await publicClient.waitForTransactionReceipt({ hash: hashApproval });

  setButtonText("APPROVING RETURN...");

  const hashReturn = await walletClient.writeContract({
    account,
    address: NFT.rentSCAddress as `0x${string}`,
    abi: collateralizedRentHolderSCAbi,
    functionName: "returnNFT",
  });

  await publicClient.waitForTransactionReceipt({ hash: hashReturn });

  setButtonText("DONE");

  invalidateQueries(queryClient);
};

const performRent = async (
  setButtonText: (text: string) => void,
  NFT: NFTInfo,
  rentHours: number,
  queryClient: QueryClient
) => {
  if (!window.ethereum) return;

  setButtonText("LOADING...");

  const { walletClient, publicClient, account } = await settingUpClientsAndAccount(window.ethereum);

  const hash = await (NFT.collateral
    ? walletClient.writeContract({
        account,
        address: NFT.rentSCAddress as `0x${string}`,
        abi: collateralizedRentHolderSCAbi,
        functionName: "rent",
        args: [rentHours],
        value: ethers.utils.parseEther(((NFT.rentRate ?? 0) * rentHours + (NFT.collateral ?? 0)).toString()).toBigInt(),
      })
    : walletClient.writeContract({
        account,
        address: NFT.rentSCAddress as `0x${string}`,
        abi: nonCollateralizedRentHolderSCAbi,
        functionName: "rent",
        args: [rentHours],
        value: ethers.utils.parseEther(((NFT.rentRate ?? 0) * rentHours).toString()).toBigInt(),
      }));

  await publicClient.waitForTransactionReceipt({ hash });

  setButtonText("DONE");

  invalidateQueries(queryClient);
};

export {
  performCollateralizedRentPublish,
  performNonCollateralizedRentPublish,
  performWithdrawNFT,
  performClaimCollateral,
  performReturn,
  performRent,
};
