import { cn } from "@/utils/utils";

interface HeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
  crossed?: "pink" | "blue";
}

const Header1 = ({ children, className, crossed, ...rest }: HeaderProps) => (
  <h2
    className={cn(
      "relative w-fit text-left font-highlight text-5xl font-extrabold ",
      crossed && "crossed-Subtitle",
      crossed === "pink" && "crossed-Subtitle--pink",
      crossed === "blue" && "crossed-Subtitle--blue",
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
        "relative w-fit text-left font-highlight text-4xl ",
        crossed && "crossed-Subtitle",
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

const Header3 = ({ children, className, crossed, ...rest }: HeaderProps) => {
  return (
    <h3
      className={cn(
        "relative w-fit max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-left font-highlight text-3xl leading-[2.3vw]",
        crossed && "crossed-Subtitle",
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

const Header4 = ({ children, className, crossed, ...rest }: HeaderProps) => {
  return (
    <h4
      className={cn(
        "relative w-fit max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-left font-highlight text-2xl leading-[1.8vw]",
        crossed && "crossed-Subtitle",
        crossed === "pink" && "crossed-Subtitle--pink",
        crossed === "blue" && "crossed-Subtitle--blue",
        className
      )}
      {...rest}
    >
      {children}
    </h4>
  );
};

export { Header1, Header2, Header3, Header4 };
