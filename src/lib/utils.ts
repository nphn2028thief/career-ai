import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleCleannedText = (text: string) =>
  text.replace(/```(?:json)?\n?/g, "").trim();

export const getNextUpdateDate = () =>
  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 24h
