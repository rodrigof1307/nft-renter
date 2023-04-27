import { Header1, Header2 } from "@/components/utils/Headers";
import NFTsDisplayer from "@/components/NFTCardDisplayer";

const Marketplace = () => {
  return (
    <div className="px-[4vw]">
      <Header1 className="mb-[2vw]">Marketplace</Header1>
      <Header2 crossed="pink">Collateralized</Header2>
      <NFTsDisplayer NFTs={[]} NFTsType="marketplace" loading={false} />
      <Header2 crossed="pink">Non-collateralized</Header2>
      <NFTsDisplayer NFTs={[]} NFTsType="marketplace" loading={false} />
    </div>
  );
};

export default Marketplace;
