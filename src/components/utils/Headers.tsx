import { cn } from "@/utils/utils";

interface HeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
  crossed?: "pink" | "blue";
}

const Header1 = ({ children, className, crossed, ...rest }: HeaderProps) => (
  <h2
    className={cn(
      "relative w-fit text-left font-highlight text-mb-5xl font-extrabold md:text-5xl ",
      crossed && "crossed-subtitle",
      crossed === "pink" && "crossed-subtitle--pink",
      crossed === "blue" && "crossed-subtitle--blue",
      className
    )}
    {...rest}
  >
    {children}
  </h2>
);

const Header2 = ({ children, className, crossed, ...rest }: HeaderProps) => {
  return (
    <h3
      className={cn(
        "relative w-fit text-left font-highlight text-mb-4xl md:text-4xl ",
        crossed && "crossed-subtitle",
        crossed === "pink" && "crossed-subtitle--pink",
        crossed === "blue" && "crossed-subtitle--blue",
        className
      )}
      {...rest}
    >
      {children}
    </h3>
  );
};

const Header3 = ({ children, className, crossed, ...rest }: HeaderProps) => {
  return (
    <h3
      className={cn(
        "relative w-fit max-w-full truncate text-left font-highlight text-mb-3xl md:text-3xl",
        crossed && "crossed-subtitle",
        crossed === "pink" && "crossed-subtitle--pink",
        crossed === "blue" && "crossed-subtitle--blue",
        className
      )}
      {...rest}
    >
      {children}
    </h3>
  );
};

const Header4 = ({ children, className, crossed, ...rest }: HeaderProps) => {
  return (
    <h4
      className={cn(
        "relative w-fit max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-left font-highlight text-mb-2xl md:text-2xl",
        crossed && "crossed-subtitle",
        crossed === "pink" && "crossed-subtitle--pink",
        crossed === "blue" && "crossed-subtitle--blue",
        className
      )}
      {...rest}
    >
      {children}
    </h4>
  );
};

export { Header1, Header2, Header3, Header4 };
