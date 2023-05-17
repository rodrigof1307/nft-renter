import { VariantProps, cva } from "class-variance-authority";
import { ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Plus, Minus, LucideProps } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

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
        small: "hover-shadow-sm px-[2vw] py-[0.7vw] text-mb-sm md:px-[1vw] md:py-[0.35vw] md:text-sm",
        medium: "hover-shadow-md px-[6vw] py-[2.1vw] text-mb-lg md:px-[3vw] md:py-[1.05vw] md:text-lg",
        large: "hover-shadow-lg px-[9vw] py-[3.15vw] text-mb-2xl md:px-[4.5vw] md:py-[1.575vw] md:text-2xl",
      },
    },
    defaultVariants: {
      tone: "blue",
      roundness: "standard",
      size: "medium",
    },
  }
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, tone, roundness, size, ...props }, ref) => (
  <button className={cn(buttonVariants({ tone, roundness, className, size }))} ref={ref} {...props} />
));
Button.displayName = "Button";

interface ButtonNFTCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone: "blue" | "pink";
  mode: "card" | "dialog";
}

const ButtonNFT = ({ children, className, tone, mode, ...rest }: ButtonNFTCardProps) => (
  <button
    className={cn(
      "hover-shadow-sm flex items-center justify-center font-highlight transition-colors disabled:pointer-events-none disabled:opacity-50",
      mode === "card" &&
        "absolute bottom-[1.2vw] left-[1.2vw] w-[27.2vw] rounded-[0.84vw] py-[1.1vw] text-mb-md md:bottom-[1vw] md:left-[1vw] md:w-[17.6vw] md:rounded-[0.6vw] md:py-[0.8vw] md:text-lg",
      mode === "dialog" &&
        "mx-auto w-[83vw] rounded-[1.4vw] py-[1.8vw] text-mb-xl md:w-[31vw] md:rounded-[0.7vw] md:py-[0.9vw] md:text-2xl",
      tone === "pink" && "bg-brightPink shadow-brightPink",
      tone === "blue" && "bg-brightBlue shadow-brightBlue",
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

type IconType = "chevronLeft" | "chevronRight" | "chevronUp" | "chevronDown" | "plus" | "minus";

interface IconButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  iconType: IconType;
}

const IconButton = ({ iconType, ...rest }: IconButtonProps) => (
  <button
    {...rest}
    className="flex h-[6vw] w-[6vw] items-center justify-center rounded-[1.2vw] border-[0.3vw] border-darkPurple bg-black/25 md:h-[3vw] md:w-[3vw] md:rounded-[0.6vw] md:border-[0.15vw]"
  >
    <Icon iconType={iconType} className="h-[4.4vw] w-[4.4vw] md:h-[2.2vw] md:w-[2.2vw]" color="white" />
  </button>
);

interface IconProps extends LucideProps {
  iconType: IconType;
}

const Icon = ({ iconType, ...rest }: IconProps) => {
  switch (iconType) {
    case "chevronLeft":
      return <ChevronLeft {...rest} />;
    case "chevronRight":
      return <ChevronRight {...rest} />;
    case "chevronUp":
      return <ChevronUp {...rest} />;
    case "chevronDown":
      return <ChevronDown {...rest} />;
    case "plus":
      return <Plus {...rest} />;
    case "minus":
      return <Minus {...rest} />;
    default:
      return <></>;
  }
};

export { Button, ButtonNFT, IconButton };
