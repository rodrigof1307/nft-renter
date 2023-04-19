import { cn } from "@/utils/utils";

interface SubTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  crossed?: "none" | "pink" | "blue";
}

const Subtitle = ({ children, className, crossed, ...rest }: SubTitleProps) => {
  return (
    <h3
      className={cn(
        "relative w-fit text-left font-highlight text-4xl text-white",
        crossed !== "none" && "crossed-Subtitle",
        crossed === "pink" && "crossed-Subtitle--pink",
        crossed === "blue" && "crossed-Subtitle--blue",
        className
      )}
      {...rest}
    >
      {children}
    </h3>
  );
};

export default Subtitle;
