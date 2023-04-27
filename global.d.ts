interface NFTInfo {
  address: string;
  collectionName?: string;
  tokenID: number;
  title: string;
  description: string;
  image?: string;
  attributes?: Record<string, any>[];
  rentRate?: number;
  collateral?: number;
  expirationDate?: string;
  rentPeriod?: number;
}

type NFTsType = "myCollectionOwned" | "myCollectionLented" | "myCollectionRented" | "marketplace";
