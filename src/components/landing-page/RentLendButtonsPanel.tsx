import Image from "next/image";
import { Button } from "@/components/utils/Buttons";
import Link from "next/link";

const RentLendButtonsPanel = () => (
  <div className="relative mb-[4vw] flex h-[37vh] max-h-[18vw] min-h-[15vw] flex-col items-center justify-evenly">
    <div className="absolute bottom-[-18vw] left-[-17vw] h-[40vw] w-[40vw]">
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
      <Link href="/my-collection">
        I WANT TO RENT
        <br />
        OTHER NFTS
      </Link>
    </Button>
  </div>
);

export default RentLendButtonsPanel;
