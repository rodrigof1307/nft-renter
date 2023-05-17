import Image from "next/image";
import { Button } from "@/components/utils/Buttons";
import Link from "next/link";

const RentLendButtonsPanel = () => (
  <div className="relative mb-[4vh] flex min-h-[40vw] flex-col items-center justify-evenly gap-[3vh] md:mb-[4vw] md:h-[37vh] md:max-h-[18vw] md:min-h-[15vw] md:gap-0">
    <div className="absolute bottom-[0] left-[-28vw] h-[40vw] w-[40vw] md:bottom-[-18vw] md:left-[-17vw]">
      <Image fill style={{ objectFit: "contain" }} alt="Object" src="/object.png" unoptimized={true} loading="eager" />
    </div>
    <Button tone="blue" roundness="full" size="large" className="mr-[25%]">
      <Link href="/my-collection">
        I WANT TO LEND
        <br />
        MY NFTS
      </Link>
    </Button>
    <Button tone="pink" roundness="full" size="large" className="ml-[25%]">
      <Link href="/marketplace">
        I WANT TO RENT
        <br />
        OTHER NFTS
      </Link>
    </Button>
  </div>
);

export default RentLendButtonsPanel;
