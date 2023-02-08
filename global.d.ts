import { ExternalProvider } from "@ethersproject/providers";

declare global {
  interface Window {
    ethereum: ExternalProvider;
  }

  interface MarketplaceTrackerRentInfo {
    rentHolderSC: string;
    nftOwner: string;
    nftAddress: string;
    nftId: number;
    pricePerDay: number;
    ownerPenalty: number;
    renterPenalty: number;
    expirationDate: number;
    currRenter: string;
    currRentEndDate: number;
  }
  
  interface NFTInfo {
    address: string;
    collectionName?: string;
    tokenID: number;
    title: string;
    description: string;
    image?: string;
    attributes?: Record<string, any>[];
  }
  
  interface FinalRentInfo {
    rentHolderSC: string;
    nftOwner: string;
    nft: NFTInfo;
    pricePerDay: number;
    ownerPenalty: number;
    renterPenalty: number;
    expirationDate: string;
    currRenter: string;
    currRentEndDate: string;
  }
}