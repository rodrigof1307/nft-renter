import { Header1, Header2 } from "@/components/utils/Headers";
import { useAccount, useChainId } from "wagmi";
import { useQuery } from "react-query";

import axios from "axios";
import NFTsDisplayer from "@/components/NFTCardDisplayer";
import { useState, useEffect } from "react";

const MyCollection = () => {
  const { address } = useAccount();
  const chainID = useChainId();
  const [isMounted, setIsMounted] = useState(false);

  const fetchOwned = ({ queryKey }: any) => {
    const addressParam = queryKey[1];
    const chainIDParam = queryKey[2].toString();
    return axios.get(`/api/fetchOwnedNFTs?address=${addressParam}&chainID=${chainIDParam}`).then((response) => {
      return response.data.ownedNFTs as NFTInfo[];
    });
  };

  const fetchLented = ({ queryKey }: any) => {
    const addressParam = queryKey[1];
    const chainIDParam = queryKey[2].toString();
    return axios.get(`/api/fetchLentedNFTs?address=${addressParam}&chainID=${chainIDParam}`).then((response) => {
      return response.data.lentedNFTs as NFTInfo[];
    });
  };

  const fetchRented = ({ queryKey }: any) => {
    const addressParam = queryKey[1];
    const chainIDParam = queryKey[2].toString();
    return axios.get(`/api/fetchRentedNFTs?address=${addressParam}&chainID=${chainIDParam}`).then((response) => {
      return response.data.rentedNFTs as NFTInfo[];
    });
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    isFetching: isLoadingOwned,
    error: errorOwned,
    data: dataOwned,
  } = useQuery({ queryKey: ["ownedNFTs", address, chainID], queryFn: fetchOwned, refetchOnWindowFocus: false });
  const {
    isFetching: isLoadingLented,
    error: errorLented,
    data: dataLented,
  } = useQuery({ queryKey: ["lentedNFTs", address, chainID], queryFn: fetchLented, refetchOnWindowFocus: false });
  const {
    isFetching: isLoadingRented,
    error: errorRented,
    data: dataRented,
  } = useQuery({ queryKey: ["rentedNFTs", address, chainID], queryFn: fetchRented, refetchOnWindowFocus: false });

  const filterOwnedNFTs = (ownedNFTs: NFTInfo[] | undefined, rentedNFTs: NFTInfo[] | undefined) => {
    if (!ownedNFTs || !rentedNFTs) return undefined;
    return ownedNFTs.filter(
      (ownedNFT) =>
        !rentedNFTs.find(
          (rentedNFT) => rentedNFT.address === ownedNFT.address && rentedNFT.tokenID === ownedNFT.tokenID
        )
    );
  };

  if (!isMounted) return null;

  return (
    <div className="px-[4vw]">
      <Header1 className="mb-[2vw]">My Collection</Header1>
      <Header2 crossed="blue">Your NFTs</Header2>
      <NFTsDisplayer
        NFTs={filterOwnedNFTs(dataOwned, dataRented)}
        NFTsType="myCollectionOwned"
        loading={isLoadingOwned}
        error={errorOwned}
      />
      <Header2 crossed="blue">On The Marketplace</Header2>
      <NFTsDisplayer NFTs={dataLented} NFTsType="myCollectionLented" loading={isLoadingLented} error={errorLented} />
      <Header2 crossed="pink">Your Rentals</Header2>
      <NFTsDisplayer NFTs={dataRented} NFTsType="myCollectionRented" loading={isLoadingRented} error={errorRented} />
    </div>
  );
};

export default MyCollection;
