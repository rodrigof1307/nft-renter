interface NFTInfo {
  address: string;
  collectionName?: string;
  tokenID: number;
  title: string;
  description: string;
  image?: string;
  attributes?: Record<string, any>[];
}
