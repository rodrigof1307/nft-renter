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
      " font-highlight font-extrabold text-[6vw] leading-[6vw] py-[1.5vh]",
  };

  return (
    <div
      className={cn(
        "forced-opacity h-[calc(63vh-7vw)] max-h-[30vw] min-h-[25vw] px-[4vw] pt-[1vh]",
        !typewriterFinished && "title-typing"
      )}
    >
      <Typewriter onInit={renderTypewriter} options={typewriterOptions} />
      <h4 className="mt-[2.5vh] text-xl leading-[1.4vw] ">
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
