import { MatchHistory, Player } from "@/lib/types";

export async function getPlayersBySteamId(
  ids: string | string[]
): Promise<Player[]> {
  const idParam = Array.isArray(ids) ? ids.join(",") : ids;

  const res = await fetch(
    `https://api.deadlock-api.com/v1/players/steam?account_ids=${idParam}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch player data: ${res.status}`);
  }

  const data = await res.json();
  return data;
}

export async function getPlayerMatchHistory(
  steamId: string
): Promise<MatchHistory[]> {
  const res = await fetch(
    `https://api.deadlock-api.com/v1/players/${steamId}/match-history`
  );
  if (!res.ok) throw new Error("Failed to fetch match history");
  return res.json();
}
