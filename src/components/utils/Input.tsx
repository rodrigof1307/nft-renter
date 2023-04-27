import { SetStateAction } from "react";
import { Dispatch } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  unit: string;
  setterFunction: Dispatch<SetStateAction<number | undefined>>;
}

const NumericInput = ({ label, unit, setterFunction, ...rest }: InputProps) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    console.log(Number(event.target.value));
    if (event.target.value === "") {
      console.log("extra");
      setterFunction(undefined);
      return;
    }
    if (!Number(event.target.value)) {
      console.log("entrei");
      setterFunction((prev) => prev);
      return;
    }
    console.log("normal");
    setterFunction(Number(event.target.value));
  };

  return (
    <p className="my-[0.5vw] text-lg">
      {label}
      <input
        {...rest}
        value={rest.value ? rest.value : ""}
        type={"string"}
        onChange={handleInputChange}
        className="mx-[0.5vw] w-[3.5vw] border-0 border-b-[0.2vw] bg-transparent pb-[0.1vw] text-center font-highlight outline-none"
      />
      <span className="font-highlight">{unit}</span>
    </p>
  );
};

export { NumericInput };
