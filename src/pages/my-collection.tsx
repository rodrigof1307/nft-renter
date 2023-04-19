import Title from "@/components/utils/Title";
import Subtitle from "@/components/utils/Subtitle";

const MyCollection = () => {
  return (
    <div className="px-[4vw]">
      <Title>My Collection</Title>
      <Subtitle crossed="blue">Your NFTs</Subtitle>
      <Subtitle crossed="blue">On The Marketplace</Subtitle>
      <Subtitle crossed="pink">Your Rentals</Subtitle>
    </div>
  );
};

export default MyCollection;
