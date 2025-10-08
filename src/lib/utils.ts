import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHeroName(name: string): string {
  return name.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
}
