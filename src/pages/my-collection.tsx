import { useEffect, useState } from "react";

import { Header1, Header2 } from "@/components/utils/Headers";
import { useAccount } from "wagmi";

import axios from "axios";
import NFTsDisplayer from "@/components/NFTCardDisplayer";

const MyCollection = () => {
  const { address } = useAccount();

  const [ownedNFTs, setOwnedNFTs] = useState<{
    NFTs: NFTInfo[];
    loading: boolean;
  }>({ NFTs: [], loading: true });

  useEffect(() => {
    if (address) {
      axios.get(`/api/fetchOwnedNFTs?address=${address}`).then((res) => {
        setOwnedNFTs({ NFTs: res.data.ownedNFTs, loading: false });
      });
    }
  }, [address]);

  return (
    <div className="px-[4vw]">
      <Header1 className="mb-[2vw]">My Collection</Header1>
      <Header2 crossed="blue">Your NFTs</Header2>
      <NFTsDisplayer NFTs={ownedNFTs.NFTs} NFTsType="myCollectionOwned" loading={ownedNFTs.loading} />
      <Header2 crossed="blue">On The Marketplace</Header2>
      <NFTsDisplayer NFTs={[]} NFTsType="myCollectionLented" loading={false} />
      <Header2 crossed="pink">Your Rentals</Header2>
      <NFTsDisplayer NFTs={[]} NFTsType="myCollectionRented" loading={false} />
    </div>
  );
};

export default MyCollection;
