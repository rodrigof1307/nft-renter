import { useState } from "react";
import Typewriter, { TypewriterClass } from "typewriter-effect";
import { cn } from "@/utils/utils";

const Description = () => {
  const [typewriterFinished, setTypewriterFinished] = useState(false);

  const renderTypewriter = (typewriter: TypewriterClass) => {
    typewriter
      .typeString("The Ultimate<br/>NFT Rental<br/>Protocol")
      .callFunction(() => {
        setTimeout(() => {
          setTypewriterFinished(true);
        }, 1000);
      })
      .start();
  };

  const typewriterOptions = {
    delay: 65,
    cursorClassName: "hidden",
    wrapperClassName:
      "font-highlight font-extrabold text-[10.5vw] leading-[10.9vw] md:text-[6vw] md:leading-[6.2vw] py-[2.25vh] md:py-[1.5vh]",
  };

  return (
    <div
      className={cn(
        "forced-opacity mb-[4vh] px-[4vw] md:mb-0 md:h-[calc(63vh-7vw)] md:max-h-[30vw] md:min-h-[25vw] md:pt-[1vh]",
        !typewriterFinished && "title-typing"
      )}
    >
      <Typewriter onInit={renderTypewriter} options={typewriterOptions} />
      <h4 className="mt-[1.5vh] w-full text-mb-2xl md:mt-[2.5vh] md:text-xl">
        The NFT Renter Protocol provides a rental solution for every renter and lenter.
        <br />
        <br />
        Explore our collateralized and non collaterlized options and find what fits you!
      </h4>
    </div>
  );
};

export default Description;
