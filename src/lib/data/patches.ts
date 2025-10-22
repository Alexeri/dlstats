import { Patch } from "@/lib/types";

export async function getPatches(): Promise<Patch[]> {
  const res = await fetch("https://api.deadlock-api.com/v1/patches", {
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error("Failed to fetch patches");
  return res.json();
}