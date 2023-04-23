import ShadedBackground from "./ShadedBackground";
import { Header3 } from "./Headers";
import { ButtonNFTCard } from "./Buttons";
import Image from "next/image";

import { cn } from "@/utils/utils";

const NFTCardBasis = () => (
  <ShadedBackground
    borderTone="pink"
    className="relative box-border h-[31vw] w-[20vw] p-[1vw]"
  >
    <div className="relative h-[17.6vw] w-[17.6vw]">
      <Image
        fill
        style={{ objectFit: "contain" }}
        alt="NFT Image"
        src="/monkey.png"
        unoptimized={true}
        loading="eager"
        className="rounded-[1vw]"
      />
    </div>
    <Header3 className="mb-[0.2vw] mt-[0.9vw]">1307</Header3>
    <p className="text-sm italic">Bored Ape Yatch Club</p>
    <ButtonNFTCard tone={"pink"} className="absolute bottom-[1vw]">
      RENT
    </ButtonNFTCard>
  </ShadedBackground>
);

const NFTCardContainer = ({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid w-full grid-cols-4 gap-y-[2.5vw]", className)}
    {...rest}
  >
    {children}
  </div>
);

export { NFTCardContainer, NFTCardBasis };
