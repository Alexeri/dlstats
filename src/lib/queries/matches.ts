import { getMatchesMetadata, getMatchMetadata, getRecentMatches } from "@/lib/data/matches";
import { getPlayerMatchHistory } from "@/lib/data/players";

export const matchQueries = {
  playerHistory: (id: string) => ({
    queryKey: ["player-match-history", id],
    queryFn: () => getPlayerMatchHistory(id),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 72, // 72 hours
  }),
  metadata: (matchId: number) => ({
    queryKey: ["match", matchId], 
    queryFn: () => getMatchMetadata(matchId),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 72, // 72 hours
  }),
  metadataArray: (matchIds: number[]) => ({
    queryKey: ["match-metadata", matchIds],
    queryFn: () => getMatchesMetadata(matchIds),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 72, // 72 hours
  }),
  recent: () => ({
    queryKey: ["matches", "recent"],
    queryFn: () => getRecentMatches(),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 3, // 3 hours
  }),
};
