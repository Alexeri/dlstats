import { getPatches } from "@/lib/data/patches";

export const patchQueries = {
  history: () => ({
    queryKey: ["patches", "latest"],
    queryFn: () => getPatches(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 72, // 72 hours
  }),
};