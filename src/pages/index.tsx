import Lines from "../../public/lines.svg";
import Usecases from "@/components/landing-page/Usecases";
import RentalMethods from "@/components/landing-page/RentalMethods";
import Description from "@/components/landing-page/Description";
import RentLendButtonsPanel from "@/components/landing-page/RentLendButtonsPanel";

export default function Home() {
  return (
    <div className="initial-animation relative mt-[-7vw] pt-[7vw]">
      <Lines
        className="absolute right-0 top-0"
        width={"28.34vw"}
        height={"80vw"}
        viewBox="0 0 524 1482"
      />
      <Description />
      <RentLendButtonsPanel />
      <Usecases />
      <RentalMethods />
    </div>
  );
}
