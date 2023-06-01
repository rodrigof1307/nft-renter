import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const nrCorrector = (num: number) => {
  return num < 10 ? `0${num}` : num;
};

export const dateFormater = (epochs?: string) => {
  if (!epochs) return "";
  const date = new Date(parseFloat(epochs));

  const hours = nrCorrector(date.getHours());
  const minutes = nrCorrector(date.getMinutes());
  const day = nrCorrector(date.getDate());
  const month = nrCorrector(date.getMonth() + 1);
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
};

// This function is used to shorten a hash to the first 6 and last 4 characters
export function shortenHash(address?: string) {
  if (!address) return undefined;

  const prefix = address.slice(0, 6);
  const suffix = address.slice(-6);

  return `${prefix}...${suffix}`;
}
