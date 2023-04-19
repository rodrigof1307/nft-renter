import Usecases from "@/components/landing-page/Usecases";
import RentalMethods from "@/components/landing-page/RentalMethods";
import Description from "@/components/landing-page/Description";
import RentLendButtonsPanel from "@/components/landing-page/RentLendButtonsPanel";

export default function Home() {
  return (
    <div className="relative mt-[-7vw] pt-[7vw]">
      <Description />
      <RentLendButtonsPanel />
      <Usecases />
      <RentalMethods />
    </div>
  );
}
