import { Header1, Header2 } from "@/components/utils/Headers";
import NFTsDisplayer from "@/components/NFTCardDisplayer";
import { useQuery } from "react-query";
import axios from "axios";
import { useChainId } from "wagmi";

const Marketplace = () => {
  const chainID = useChainId();

  const fetchMarketplace = ({ queryKey }: any) => {
    const chainIDParam = queryKey[1].toString();
    return axios.get(`/api/fetchMarketplaceNFTs?chainID=${chainIDParam}`).then((res) => {
      return {
        collateralizedRentals: res.data.collateralizedRentals,
        nonCollateralizedRentals: res.data.nonCollateralizedRentals,
      } as {
        collateralizedRentals: NFTInfo[];
        nonCollateralizedRentals: NFTInfo[];
      };
    });
  };

  const { isLoading, error, data } = useQuery({ queryKey: ["marketplaceNFTs", chainID], queryFn: fetchMarketplace });

  return (
    <div className="px-[4vw]">
      <Header1 className="mb-[2vw]">Marketplace</Header1>
      <Header2 crossed="pink">Collateralized</Header2>
      <NFTsDisplayer NFTs={data?.collateralizedRentals} NFTsType="marketplace" loading={isLoading} error={error} />
      <Header2 crossed="pink">Non-collateralized</Header2>
      <NFTsDisplayer NFTs={data?.nonCollateralizedRentals} NFTsType="marketplace" loading={isLoading} error={error} />
    </div>
  );
};

export default Marketplace;
