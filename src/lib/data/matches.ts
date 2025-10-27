import { MatchMetadata, MatchRecent, MatchResponse } from "@/lib/types";

export async function getMatchMetadata(
  matchId: number
): Promise<MatchResponse> {
  const res = await fetch(
    `https://api.deadlock-api.com/v1/matches/${matchId}/metadata`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch match metadata: ${res.status}`);
  }

  return res.json();
}

export async function getMatchesMetadata(
  matchIds: number[]
): Promise<MatchMetadata[]> {
  if (!matchIds.length) return [];

  const params = new URLSearchParams({
    match_ids: matchIds.join(","),
    include_player_items: "true",
    include_player_stats: "true",
  });

  const res = await fetch(
    `https://api.deadlock-api.com/v1/matches/metadata?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch match metadata: ${res.status}`);
  }

  return res.json();
}

export async function getRecentMatches(): Promise<MatchRecent[]> {
  const res = await fetch(
    `https://api.deadlock-api.com/v1/matches/recently-fetched?player_ingested_only=true`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch match metadata: ${res.status}`);
  }

  return res.json();
}
