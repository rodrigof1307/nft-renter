import { cn } from "@/utils/utils";

interface ShadedBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  borderTone?: "pink" | "blue";
}

const ShadedBackground = ({ children, className, borderTone, ...rest }: ShadedBackgroundProps) => (
  <div
    className={cn(
      "relative rounded-[1.5vw] border-[0.2vw] bg-gradient-to-br from-shadedBackgroundPurple1 via-shadedBackgroundPurple2 to-shadedBackgroundPurple3",
      !borderTone && "border-darkPurple",
      borderTone === "pink" && "border-brightPink border-opacity-70 hover:border-opacity-100",
      borderTone === "blue" && "border-brightBlue border-opacity-70 hover:border-opacity-100",
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

export default ShadedBackground;
