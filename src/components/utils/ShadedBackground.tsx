import { cn } from "@/utils/utils";

const ShadedBackground = ({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "rounded-[1.5vw] border-[0.15vw] border-darkPurple bg-black/25",
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

export default ShadedBackground;
