import { getAllItems, getItemStatsByHero } from "@/lib/data/heroes";

export const itemQueries = {
  all: () => ({
    queryKey: ["items", "all"],
    queryFn: getAllItems,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 72, // 72 hours
  }),

  heroStats: (heroId: number, rank: string, timeframe: string) => ({
    queryKey: ["item-stats", heroId, rank, timeframe],
    queryFn: () =>
      getItemStatsByHero({
        hero_id: heroId,
        min_average_badge: rank,
        timeframe,
      }),
    staleTime: 1000 * 60 * 15, // 15 min
    gcTime: 1000 * 60 * 60, // 1 hour
  }),
};
