import Typewriter, { TypewriterClass } from "typewriter-effect";

const Description = () => {
  const renderTypewriter = (typewriter: TypewriterClass) => {
    typewriter.typeString("The Ultimate<br/>NFT Rental<br/>Protocol").start();
  };

  const typewriterOptions = {
    delay: 65,
    wrapperClassName:
      "text-white font-highlight font-extrabold text-[6vw] leading-[6vw] py-[1.5vh]",
  };

  return (
    <div className="forced-opacity h-[calc(63vh-7vw)] max-h-[30vw] min-h-[25vw] px-[4vw] pt-[1vh]">
      <Typewriter onInit={renderTypewriter} options={typewriterOptions} />
      <h4 className="initial-animation mt-[2.5vh] text-xl leading-[1.4vw] text-white">
        The NFT Renter Protocol provides a rental solution for every renter and
        lenter.
        <br />
        <br />
        Explore our collateralized and non collaterlized options and find what
        fits you!
      </h4>
    </div>
  );
};

export default Description;