import { Alchemy, Network, Nft } from "alchemy-sdk";

import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  ownedNFTs?: NFTInfo[];
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { address, chainID } = req.query;

  // For some reason, if the address is not passed it is a string with value "undefined" instead of undefined
  if (address === "undefined" || typeof address !== "string") {
    return res.status(400).json({ error: "User address is required." });
  }

  // For some reason, if the chainID is not passed it is a string with value "undefined" instead of undefined
  if (chainID === "undefined" || typeof chainID !== "string") {
    return res.status(400).json({ error: "Invalid chainID" });
  }

  if (chainID !== "11155111") {
    return res.status(200).json({ ownedNFTs: [] as NFTInfo[] });
  }

  try {
    const config = {
      apiKey: process.env.NEXT_PUBLIC_SEPOLIA_API_KEY,
      network: Network.ETH_SEPOLIA,
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
          image: tokenData.rawMetadata?.image,
          attributes: tokenData.rawMetadata?.attributes,
          tokenURI: tokenData.tokenUri?.raw ?? "",
        } as NFTInfo)
    );

    return res.status(200).json({ ownedNFTs });
  } catch (error) {
    console.error("Error fetching collection NFTs:", error);
    return res.status(500).json({ error: "Failed to fetch collection NFTs." });
  }
}
