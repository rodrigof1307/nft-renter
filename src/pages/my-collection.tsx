import Title from "@/components/utils/Title";
import SubTitle from "@/components/utils/SubTitle";

const MyCollection = () => {
  return (
    <div className="px-[4vw]">
      <Title>My Collection</Title>
      <SubTitle crossed="blue">Your NFTs</SubTitle>
      <SubTitle crossed="blue">On The Marketplace</SubTitle>
      <SubTitle crossed="pink">Your Rentals</SubTitle>
    </div>
  );
};

export default MyCollection;
