import { Header1, Header2 } from "@/components/utils/Headers";
import NFTsDisplayer from "@/components/NFTCardDisplayer";
import { useQuery } from "react-query";
import axios from "axios";

const Marketplace = () => {
  const fetchMarketplace = () => {
    return axios.get(`/api/fetchMarketplaceNFTs`).then((res) => {
      return {
        collateralizedRentals: res.data.collateralizedRentals,
        nonCollateralizedRentals: res.data.nonCollateralizedRentals,
      } as {
        collateralizedRentals: NFTInfo[];
        nonCollateralizedRentals: NFTInfo[];
      };
    });
  };

  const { isLoading, error, data } = useQuery("marketplaceNFTs", fetchMarketplace);

  return (
    <div className="px-[4vw]">
      <Header1 className="mb-[2vw]">Marketplace</Header1>
      <Header2 crossed="pink">Collateralized</Header2>
      <NFTsDisplayer NFTs={data?.collateralizedRentals} NFTsType="marketplace" loading={isLoading} />
      <Header2 crossed="pink">Non-collateralized</Header2>
      <NFTsDisplayer NFTs={data?.nonCollateralizedRentals} NFTsType="marketplace" loading={isLoading} />
    </div>
  );
};

export default Marketplace;
