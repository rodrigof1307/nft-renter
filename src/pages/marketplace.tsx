import { Header1, Header2 } from "@/components/utils/Headers";
import NFTsDisplayer from "@/components/utils/NFTCards";

const Marketplace = () => {
  return (
    <div className="px-[4vw]">
      <Header1 className="mb-[2vw]">Marketplace</Header1>
      <Header2 crossed="pink">Collateralized</Header2>
      <NFTsDisplayer NFTs={[]} NFTsType="marketplace" loading={true} />
      <Header2 crossed="pink">Non-collateralized</Header2>
      <NFTsDisplayer NFTs={[]} NFTsType="marketplace" loading={true} />
    </div>
  );
};

export default Marketplace;
