import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getWinRateClass(winRateStr: string): string {
  const winRate = parseFloat(winRateStr.replace("%", ""));
  if (winRate >= 53) return "text-green-400";
  if (winRate >= 51.5) return "text-green-300";
  if (winRate >= 50) return "text-green-200";
  if (winRate >= 48.5) return "text-red-200";
  if (winRate > 45) return "text-red-300";
  return "text-red-400";
}