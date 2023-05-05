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
    <p className="my-[0.5vw] text-lg">
      {label}
      <input
        {...rest}
        value={rest.value ? rest.value : ""}
        type={"string"}
        onChange={handleInputChange}
        className={cn(
          "mx-[0.5vw] w-[4vw] border-0 border-b-[0.2vw] bg-transparent pb-[0.1vw] text-center font-highlight outline-none",
          rest.className
        )}
      />
      <span className="font-highlight">{unit}</span>
    </p>
  );
};

const FilledInput = ({ label, value, unit, size, className }: FilledInputProps) => {
  if (!value || value === "0") return <></>;

  return (
    // eslint-disable-next-line tailwindcss/classnames-order, tailwindcss/no-custom-classname
    <p className={cn(`my-[0.4vw] text-${size ?? "lg"}`, className)}>
      {label}
      <span className="font-highlight">{` ${value} ${unit}`}</span>
    </p>
  );
};

export { NumericInput, FilledInput };
