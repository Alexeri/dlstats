import {
  getAllHeroesAssets,
  getHeroAbilities,
  getHeroByName,
  getHeroCounters,
  getHeroWinRate,
} from "@/lib/data/heroes";
import { getHeroLeaderboard } from "@/lib/data/leaderboards";

export const heroQueries = {
  hero: (name: string) => ({
    queryKey: ["hero", name],
    queryFn: () => getHeroByName(name),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 6, // 6 hours
  }),

  abilities: (heroId: number) => ({
    queryKey: ["abilities", heroId],
    queryFn: () => getHeroAbilities(heroId),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 48, // 72 hours
  }),

  assets: () => ({
    queryKey: ["heroes-assets"],
    queryFn: getAllHeroesAssets,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 72, // 72 hours
  }),

  winRates: (rank: string, timeframe: string) => ({
    queryKey: ["hero-winrates", rank, timeframe],
    queryFn: () => getHeroWinRate(rank, timeframe),
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  }),

  gameCounters: (rank: string, timeframe: string) => ({
    queryKey: ["hero-counters", rank, timeframe, "game"],
    queryFn: () => getHeroCounters({ min_average_badge: rank, timeframe }),
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  }),

  laneCounters: (rank: string, timeframe: string) => ({
    queryKey: ["hero-counters", rank, timeframe, "lane"],
    queryFn: () =>
      getHeroCounters({
        min_average_badge: rank,
        timeframe,
        same_lane_filter: true,
      }),
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  }),

  leaderboard: (heroId: number, region: string) => ({
    queryKey: ["hero-leaderboard", heroId, region],
    queryFn: () => getHeroLeaderboard(heroId, region),
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  }),
};
