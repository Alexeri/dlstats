import { getPlayersBySteamId } from "@/lib/data/players";

export const playerQueries = {
  getById: (id: string) => ({
    queryKey: ["player", id],
    queryFn: () => getPlayersBySteamId(id),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 3, // 3 hours
  }),
};