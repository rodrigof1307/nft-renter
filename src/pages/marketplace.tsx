import { Header1, Header2 } from "@/components/utils/Headers";

const Marketplace = () => {
  return (
    <div className="px-[4vw]">
      <Header1 className="mb-[2vw]">Marketplace</Header1>
      <Header2 className="my-[1.5vw]" crossed="pink">
        Collateralized
      </Header2>
      <Header2 className="my-[1.5vw]" crossed="pink">
        Non-collateralized
      </Header2>
    </div>
  );
};

export default Marketplace;
