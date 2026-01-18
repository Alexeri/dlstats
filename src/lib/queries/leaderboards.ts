import { getLeaderboard } from "@/lib/data/leaderboards";

export const leaderboardsQueries = {
    data: (region?: string) => ({
        queryKey: ["leaderboards", region ?? "Europe"],
        queryFn: () => getLeaderboard(region ?? "Europe"),
        staleTime: 1000 * 60 * 30, // 30 minutes
        gcTime: 1000 * 60 * 60, // 1 hour
    }),
};