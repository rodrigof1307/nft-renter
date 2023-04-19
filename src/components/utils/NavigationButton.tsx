import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  LucideProps,
} from "lucide-react";

type Directions = "left" | "right" | "up" | "down";

interface NavigationButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  direction: Directions;
}

const NavigationButton = ({ direction, ...rest }: NavigationButtonProps) => (
  <button
    {...rest}
    className="flex h-[3vw] w-[3vw] items-center justify-center rounded-[0.6vw] border-[0.15vw] border-darkPurple bg-black/25"
  >
    <Chevron direction={direction} size={"2.2vw"} color="white" />
  </button>
);

interface ChevronProps extends LucideProps {
  direction: Directions;
}

const Chevron = ({ direction, ...rest }: ChevronProps) => {
  switch (direction) {
    case "left":
      return <ChevronLeft {...rest} />;
    case "right":
      return <ChevronRight {...rest} />;
    case "up":
      return <ChevronUp {...rest} />;
    case "down":
      return <ChevronDown {...rest} />;
    default:
      return <></>;
  }
};

export default NavigationButton;
