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
        small: "hover-shadow-sm px-[1vw] py-[0.36vw] text-[0.4vw] leading-[0.6vw]",
        medium: "hover-shadow-md px-[3vw] py-[1.08vw] text-[1.2vw] leading-[1.4vw]",
        large: "hover-shadow-lg px-[4.5vw] py-[1.62vw] text-[1.8vw] leading-[2vw]",
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
      mode === "card" && "absolute bottom-[1vw] left-[1vw] w-[17.6vw] rounded-[0.6vw] py-[0.8vw] text-lg",
      mode === "dialog" && "mx-auto w-[22vw] rounded-[0.7vw] py-[0.9vw] text-2xl",
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
    className="flex h-[3vw] w-[3vw] items-center justify-center rounded-[0.6vw] border-[0.15vw] border-darkPurple bg-black/25"
  >
    <Icon iconType={iconType} size={"2.2vw"} color="white" />
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
