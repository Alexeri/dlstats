import { LeaderboardPlayer } from "@/lib/types";

export type Region = "Europe" | "Asia" | "NAmerica" | "SAmerica" | "Oceania";

const ALLOWED_REGIONS: Region[] = [
  "Europe",
  "Asia",
  "NAmerica",
  "SAmerica",
  "Oceania",
];

export async function getLeaderboard(
  region?: string
): Promise<LeaderboardPlayer[]> {
  const safeRegion: Region = ALLOWED_REGIONS.includes(region as Region)
    ? (region as Region)
    : "Europe";
  const res = await fetch(
    `https://api.deadlock-api.com/v1/leaderboard/${safeRegion}`
  );
  if (!res.ok)
    throw new Error(`Failed to fetch leaderboard for region: ${safeRegion}`);
  const json = await res.json();
  return json.entries as LeaderboardPlayer[];
}

export async function getHeroLeaderboard(
  heroId: number,
  region: string
): Promise<LeaderboardPlayer[]> {
  const safeRegion: Region = ALLOWED_REGIONS.includes(region as Region)
    ? (region as Region)
    : "Europe";
  const res = await fetch(
    `https://api.deadlock-api.com/v1/leaderboard/${safeRegion}/${heroId}`
  );
  if (!res.ok)
    throw new Error(
      `Failed to fetch hero leaderboard for region: ${safeRegion} and hero: ${heroId}`
    );
  const json = await res.json();
  return json.entries as LeaderboardPlayer[];
}
