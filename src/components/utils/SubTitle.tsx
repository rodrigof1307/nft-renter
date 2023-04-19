import { cn } from "@/utils/utils";

interface SubTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  crossed?: "none" | "pink" | "blue";
}

const SubTitle = ({ children, className, crossed, ...rest }: SubTitleProps) => {
  return (
    <h2
      className={cn(
        "relative w-fit text-left font-highlight text-3xl text-white",
        crossed !== "none" && "crossed-subtitle",
        crossed === "pink" && "crossed-subtitle--pink",
        crossed === "blue" && "crossed-subtitle--blue",
        className
      )}
      {...rest}
    >
      {children}
    </h2>
  );
};

export default SubTitle;
