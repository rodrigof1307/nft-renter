import { Header3 } from "./utils/Headers";
import { NFTCard, NFTLoadingCard } from "./NFTCard";
import { useAccount } from "wagmi";
import { ReactNode } from "react";

enum NFTsTypeColor {
  myCollectionOwned = "blue",
  myCollectionLented = "blue",
  myCollectionRented = "pink",
  marketplace = "pink",
}

interface NFTsContainerProps {
  children: ReactNode;
}

const NFTsContainer = ({ children }: NFTsContainerProps) => (
  <div className="mb-[4.5vw] mt-[3vw] grid w-full grid-cols-3 gap-x-[calc((92vw-3*28.4vw)/2)] gap-y-[2.5vw] md:mb-[3vw] md:mt-[2vw] md:grid-cols-4 md:gap-x-[calc((92vw-4*20.4vw)/3)]">
    {children}
  </div>
);

interface NFTsDisplayerProps {
  NFTs?: NFTInfo[];
  NFTsType: NFTsType;
  loading: boolean;
  error: null | unknown;
}

const NFTsDisplayer = ({ NFTs, NFTsType, loading, error }: NFTsDisplayerProps) => {
  const { address } = useAccount();

  const notAvailableMessage = () => {
    switch (NFTsType) {
      case "myCollectionOwned":
        return "You don't own any NFTs";
      case "myCollectionLented":
        return "You haven't lent any NFTs";
      case "myCollectionRented":
        return "You haven't rented any NFTs";
      case "marketplace":
        return "No NFTs are available for rent";
      default:
        return "Error";
    }
  };

  if (!address && NFTsType !== "marketplace") {
    return (
      <div className="flex items-center justify-center py-[11vw]">
        <Header3 className="overflow-auto text-clip whitespace-normal text-center md:truncate">
          Connect your wallet to see your NFTs
        </Header3>
      </div>
    );
  }

  if (typeof error !== "undefined" && error !== null) {
    return (
      <div className="flex items-center justify-center py-[11vw]">
        <Header3 className="overflow-auto text-clip whitespace-normal text-center md:truncate">
          Something went wrong while fetching the NFTs, please try again
        </Header3>
      </div>
    );
  }

  if (loading) {
    return (
      <NFTsContainer>
        <NFTLoadingCard borderTone={NFTsTypeColor[NFTsType]} />
        <NFTLoadingCard borderTone={NFTsTypeColor[NFTsType]} />
        <NFTLoadingCard borderTone={NFTsTypeColor[NFTsType]} />
        <NFTLoadingCard borderTone={NFTsTypeColor[NFTsType]} />
      </NFTsContainer>
    );
  }

  if (!NFTs || NFTs.length === 0) {
    return (
      <div className="flex items-center justify-center py-[11vw]">
        <Header3>{notAvailableMessage()}</Header3>
      </div>
    );
  }

  return (
    <NFTsContainer>
      {NFTs.map((NFT) => (
        <NFTCard NFT={NFT} NFTsType={NFTsType} key={NFT.address + NFT.tokenID} />
      ))}
    </NFTsContainer>
  );
};

export default NFTsDisplayer;
