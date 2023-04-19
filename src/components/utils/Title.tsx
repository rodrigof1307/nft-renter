import { cn } from "@/utils/utils";

const Title = ({
  children,
  className,
  ...rest
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    className={cn(
      "font-highlight text-5xl font-extrabold text-white",
      className ?? ""
    )}
    {...rest}
  >
    {children}
  </h2>
);

export default Title;
