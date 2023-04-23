import { Header1, Header2 } from "@/components/utils/Headers";

const MyCollection = () => {
  return (
    <div className="px-[4vw]">
      <Header1 className="mb-[2vw]">My Collection</Header1>
      <Header2 className="mb-[1.5vw]" crossed="blue">
        Your NFTs
      </Header2>
      <Header2 className="mb-[1.5vw]" crossed="blue">
        On The Marketplace
      </Header2>
      <Header2 className="mb-[1.5vw]" crossed="pink">
        Your Rentals
      </Header2>
    </div>
  );
};

export default MyCollection;
