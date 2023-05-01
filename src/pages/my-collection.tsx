import { Header1, Header2 } from "@/components/utils/Headers";
import { useAccount } from "wagmi";
import { useQuery, useQueryClient } from "react-query";

import axios from "axios";
import NFTsDisplayer from "@/components/NFTCardDisplayer";
import { useEffect } from "react";

const MyCollection = () => {
  const { address } = useAccount();

  const queryClient = useQueryClient();

  const fetchOwned = () => {
    return axios.get(`/api/fetchOwnedNFTs?address=${address}`).then((response) => {
      return response.data.ownedNFTs as NFTInfo[];
    });
  };

  const fetchLented = () => {
    return axios.get(`/api/fetchLentedNFTs?address=${address}`).then((response) => {
      return response.data.lentedNFTs as NFTInfo[];
    });
  };

  const fetchRented = () => {
    return axios.get(`/api/fetchRentedNFTs?address=${address}`).then((response) => {
      return response.data.rentedNFTs as NFTInfo[];
    });
  };

  useEffect(() => {
    if (address) {
      queryClient.invalidateQueries("ownedNFTs");
      queryClient.invalidateQueries("lentedNFTs");
      queryClient.invalidateQueries("rentedNFTs");
    }
  }, [address]);

  const { isLoading: isLoadingOwned, error: errorOwned, data: dataOwned } = useQuery("ownedNFTs", fetchOwned);
  const { isLoading: isLoadingLented, error: errorLented, data: dataLented } = useQuery("lentedNFTs", fetchLented);
  const { isLoading: isLoadingRented, error: errorRented, data: dataRented } = useQuery("rentedNFTs", fetchRented);

  const filterOwnedNFTs = (ownedNFTs: NFTInfo[] | undefined, rentedNFTs: NFTInfo[] | undefined) => {
    if (!ownedNFTs || !rentedNFTs) return [];
    return ownedNFTs.filter(
      (ownedNFT) =>
        !rentedNFTs.find(
          (rentedNFT) => rentedNFT.address === ownedNFT.address && rentedNFT.tokenID === ownedNFT.tokenID
        )
    );
  };

  return (
    <div className="px-[4vw]" suppressHydrationWarning={true}>
      <Header1 className="mb-[2vw]">My Collection</Header1>
      <Header2 crossed="blue">Your NFTs</Header2>
      <NFTsDisplayer
        NFTs={filterOwnedNFTs(dataOwned, dataRented)}
        NFTsType="myCollectionOwned"
        loading={isLoadingOwned}
      />
      <Header2 crossed="blue">On The Marketplace</Header2>
      <NFTsDisplayer NFTs={dataLented} NFTsType="myCollectionLented" loading={isLoadingLented} />
      <Header2 crossed="pink">Your Rentals</Header2>
      <NFTsDisplayer NFTs={dataRented} NFTsType="myCollectionRented" loading={isLoadingRented} />
    </div>
  );
};

export default MyCollection;
