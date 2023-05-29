import { QueryClient } from "react-query";
import { createWalletClient, custom, http, createPublicClient, fromHex } from "viem";
import { hardhat, sepolia } from "viem/chains";
import { ethers } from "ethers";
import { erc721ABI } from "wagmi";
import { Ethereum } from "@wagmi/core";
import {
  collateralizedRentHolderABI,
  collateralizedRentHolderBytecode,
  nonCollateralizedRentHolderABI,
  nonCollateralizedRentHolderBytecode,
} from "@/consts";
import * as addresses from "@/../addresses.json";

const chains = {
  "31337": hardhat,
  "1337": hardhat,
  "11155111": sepolia,
};

const settingUpClientsAndAccount = async (ethereum: Ethereum) => {
  const chainID = fromHex(
    (await ethereum.request({ method: "eth_chainId" })) as `0x${string}`,
    "number"
  ).toString() as keyof typeof chains;

  const chain = chains[chainID];

  const walletClient = createWalletClient({
    chain,
    transport: custom(ethereum),
  });

  const publicClient = createPublicClient({
    chain,
    transport: http(chainID === "11155111" ? undefined : "http://127.0.0.1:8545/"),
  });

  const [account] = await walletClient.getAddresses();

  return { chainID, walletClient, publicClient, account };
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

  const { chainID, walletClient, publicClient, account } = await settingUpClientsAndAccount(window.ethereum);

  const hashDeployment = await (collateral
    ? walletClient.deployContract({
        abi: collateralizedRentHolderABI,
        account,
        args: [
          NFT.address as `0x${string}`,
          BigInt(NFT.tokenID),
          BigInt(ethers.utils.parseEther(rentRate).toString()),
          BigInt(ethers.utils.parseEther(collateral).toString()),
          addresses[chainID].MarketplaceTracker as `0x${string}`,
        ],
        bytecode: collateralizedRentHolderBytecode as `0x${string}`,
        chain: chains[chainID],
      })
    : walletClient.deployContract({
        abi: nonCollateralizedRentHolderABI,
        account,
        args: [
          NFT.address as `0x${string}`,
          BigInt(NFT.tokenID),
          BigInt(ethers.utils.parseEther(rentRate).toString()),
          addresses[chainID].MarketplaceTracker as `0x${string}`,
        ],
        bytecode: nonCollateralizedRentHolderBytecode as `0x${string}`,
        chain: chains[chainID],
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
        abi: collateralizedRentHolderABI,
        functionName: "publishNFT",
        chain: chains[chainID],
      })
    : walletClient.writeContract({
        account,
        address: contractAddress as `0x${string}`,
        abi: nonCollateralizedRentHolderABI,
        functionName: "publishNFT",
        chain: chains[chainID],
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

  const { chainID, walletClient, publicClient, account } = await settingUpClientsAndAccount(window.ethereum);

  setButtonText("LOADING...");

  const hashWithdraw = await (NFT.collateral
    ? walletClient.writeContract({
        account,
        address: NFT.rentSCAddress as `0x${string}`,
        abi: collateralizedRentHolderABI,
        functionName: mode,
        chain: chains[chainID],
      })
    : walletClient.writeContract({
        account,
        address: NFT.rentSCAddress as `0x${string}`,
        abi: nonCollateralizedRentHolderABI,
        functionName: "withdrawNFT",
        chain: chains[chainID],
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

  const { chainID, walletClient, publicClient, account } = await settingUpClientsAndAccount(window.ethereum);

  const hashApproval = await walletClient.writeContract({
    account,
    address: NFT.address as `0x${string}`,
    abi: erc721ABI,
    functionName: "approve",
    args: [NFT.rentSCAddress as `0x${string}`, BigInt(NFT.tokenID)],
    value: BigInt(0),
    chain: chains[chainID],
  });

  await publicClient.waitForTransactionReceipt({ hash: hashApproval });

  setButtonText("APPROVING RETURN...");

  const hashReturn = await walletClient.writeContract({
    account,
    address: NFT.rentSCAddress as `0x${string}`,
    abi: collateralizedRentHolderABI,
    functionName: "returnNFT",
    chain: chains[chainID],
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

  const { chainID, walletClient, publicClient, account } = await settingUpClientsAndAccount(window.ethereum);

  const hash = await (NFT.collateral
    ? walletClient.writeContract({
        account,
        address: NFT.rentSCAddress as `0x${string}`,
        abi: collateralizedRentHolderABI,
        functionName: "rent",
        args: [rentHours],
        value: ethers.utils.parseEther(((NFT.rentRate ?? 0) * rentHours + (NFT.collateral ?? 0)).toString()).toBigInt(),
        chain: chains[chainID],
      })
    : walletClient.writeContract({
        account,
        address: NFT.rentSCAddress as `0x${string}`,
        abi: nonCollateralizedRentHolderABI,
        functionName: "rent",
        args: [rentHours],
        value: ethers.utils.parseEther(((NFT.rentRate ?? 0) * rentHours).toString()).toBigInt(),
        chain: chains[chainID],
      }));

  await publicClient.waitForTransactionReceipt({ hash });

  setButtonText("DONE");

  invalidateQueries(queryClient);
};

const performBurn = async (setButtonText: (text: string) => void, NFT: NFTInfo, queryClient: QueryClient) => {
  if (!window.ethereum) return;

  setButtonText("LOADING...");

  const { chainID, walletClient, publicClient, account } = await settingUpClientsAndAccount(window.ethereum);

  const hash = await walletClient.writeContract({
    account,
    address: NFT.address as `0x${string}`,
    abi: erc721ABI,
    functionName: "transferFrom",
    args: [account, "0x000000000000000000000000000000000000dEaD", BigInt(NFT.tokenID)],
    chain: chains[chainID],
    value: BigInt(0),
  });

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
  performBurn,
};
