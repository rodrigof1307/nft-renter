import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  LucideProps,
} from "lucide-react";

import { cn } from "../../utils/utils";

const buttonVariants = cva(
  "inline-flex w-fit items-center justify-center rounded-md font-highlight  transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      tone: {
        blue: "bg-brightBlue shadow-brightBlue",
        pink: "bg-brightPink shadow-brightPink",
        purple: "bg-darkPurple shadow-darkPurple",
        red: "bg-darkPurple shadow-darkPurple",
      },
      roundness: {
        full: "rounded-full",
        standard: "rounded-md",
      },
      size: {
        small: "hover-shadow-sm px-[1vw] py-[0.36vw] text-[0.4vw]",
        medium: "hover-shadow-md px-[3vw] py-[1.08vw] text-[1.2vw]",
        large: "hover-shadow-lg px-[4.5vw] py-[1.62vw] text-[1.8vw]",
      },
    },
    defaultVariants: {
      tone: "blue",
      roundness: "standard",
      size: "medium",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, tone, roundness, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ tone, roundness, className, size }))}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";

interface ButtonNFTCardProps extends React.HTMLAttributes<HTMLButtonElement> {
  tone: "blue" | "pink";
}

const ButtonNFTCard = ({
  children,
  className,
  tone,
  ...rest
}: ButtonNFTCardProps) => (
  <button
    className={cn(
      "hover-shadow-sm flex w-[17.6vw] items-center justify-center rounded-[0.6vw] py-[0.8vw] font-highlight text-[1.2vw] transition-colors disabled:pointer-events-none disabled:opacity-50",
      tone === "pink" && "bg-brightPink shadow-brightPink",
      tone === "blue" && "bg-brightBlue shadow-brightBlue",
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

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

export { Button, ButtonNFTCard, NavigationButton };
