import { SetStateAction, Dispatch } from "react";
import { cn } from "@/utils/utils";

interface FilledInputProps {
  label: string;
  value?: string;
  unit: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

interface NumericInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  unit: string;
  setterFunction: Dispatch<SetStateAction<string | undefined>>;
}

const NumericInput = ({ label, unit, setterFunction, ...rest }: NumericInputProps) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setterFunction(event.target.value);
  };

  return (
    <p className="my-[0.5vh] text-mb-lg md:my-[0.5vw] md:text-lg">
      {label}
      <input
        {...rest}
        value={rest.value ? rest.value : ""}
        type={"string"}
        onChange={handleInputChange}
        className={cn(
          "mx-[1vw] w-[10vw] rounded-[1vw] border-[0.3vw] bg-transparent py-[0.8vw] text-center font-highlight outline-none md:mx-[0.5vw] md:w-[4vw] md:rounded-none md:border-0 md:border-b-[0.2vw] md:pb-[0.1vw]",
          rest.className
        )}
      />
      <span className="font-highlight">{unit}</span>
    </p>
  );
};

const FilledInput = ({ label, value, unit, size = "lg", className }: FilledInputProps) => {
  if (!value || value === "0") return <></>;

  return (
    // eslint-disable-next-line tailwindcss/classnames-order, tailwindcss/no-custom-classname
    <p className={cn(`my-[0.4vw] text-mb-${size} md:text-${size}`, className)}>
      {label}
      <span className="font-highlight">{` ${value} ${unit}`}</span>
    </p>
  );
};

export { NumericInput, FilledInput };
