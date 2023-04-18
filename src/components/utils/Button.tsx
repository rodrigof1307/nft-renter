import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";

import { cn } from "../../utils/utils";

const buttonVariants = cva(
  "inline-flex w-fit items-center justify-center rounded-md font-highlight text-white transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      tone: {
        blue: "bg-brightBlue shadow-brightBlue",
        pink: "bg-brightPink shadow-brightPink",
        purple: "bg-darkPurple shadow-darkPurple",
      },
      roundness: {
        full: "rounded-full",
        standard: "rounded-md",
      },
      size: {
        small:
          "hover-shadow-sm px-[1vw] py-[0.36vw] text-[0.4vw] leading-[0.4vw]",
        medium:
          "hover-shadow-md px-[3vw] py-[1.08vw] text-[1.2vw] leading-[1.2vw]",
        large:
          "hover-shadow-lg px-[4.5vw] py-[1.62vw] text-[1.8vw] leading-[1.8vw]",
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

export { Button, buttonVariants };
