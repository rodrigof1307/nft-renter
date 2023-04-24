import { Alchemy, Network, Nft } from "alchemy-sdk";

import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  ownedNFTs?: NFTInfo[];
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { address } = req.query;

  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "User address is required." });
  }

  try {
    const config = {
      apiKey: process.env.ALCHEMY_API_KEY,
      network: Network.ETH_GOERLI,
    };

    const alchemy = new Alchemy(config);
    const ownedNFTsBasis = (await alchemy.nft.getNftsForOwner(address)).ownedNfts;

    const ownedNFTsMetadataPromises: Promise<Nft>[] = [];

    ownedNFTsBasis.forEach(({ contract, tokenId }) => {
      const tokenData = alchemy.nft.getNftMetadata(contract.address, tokenId, {});
      ownedNFTsMetadataPromises.push(tokenData);
    });

    const ownedNFTsWithMetadata = await Promise.all(ownedNFTsMetadataPromises);

    const ownedNFTs = ownedNFTsWithMetadata.map(
      (tokenData: Nft) =>
        ({
          address: tokenData.contract.address,
          collectionName: tokenData.contract.name ?? "",
          tokenID: parseFloat(tokenData.tokenId),
          title: tokenData.rawMetadata?.name,
          description: tokenData.rawMetadata?.description,
          image: tokenData.media[0].thumbnail,
          attributes: tokenData.rawMetadata?.attributes,
        } as NFTInfo)
    );

    return res.status(200).json({ ownedNFTs });
  } catch (error) {
    console.error("Error fetching collection NFTs:", error);
    return res.status(500).json({ error: "Failed to fetch collection NFTs." });
  }
}
