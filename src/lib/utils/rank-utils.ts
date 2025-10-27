export function getSubrankImage(value: number): string {
  if (value == null || isNaN(value)) {
    console.warn(`Invalid rank value: ${value}`);
    return "";
  }

  const tier = Math.floor(value / 10);
  const rank = value % 10;

  if (tier === 0) {
    return "https://assets-bucket.deadlock-api.com/assets-api-res/images/ranks/rank0/badge_lg.png";
  }

  if (tier < 1 || tier > 11 || rank < 1 || rank > 6) {
    console.warn(`Invalid tier or rank: ${value} (tier: ${tier}, rank: ${rank})`);
    return "";
  }

  return `https://assets-bucket.deadlock-api.com/assets-api-res/images/ranks/rank${tier}/badge_lg_subrank${rank}.png`;
}

const RANK_NAMES = [
  "Obscurus",
  "Initiate",
  "Seeker",
  "Alchemist",
  "Arcanist",
  "Ritualist",
  "Emissary",
  "Archon",
  "Oracle",
  "Phantom",
  "Ascendant",
  "Eternus",
] as const;

export function getRankName(
  value: number,
  { includeSubrank = false }: { includeSubrank?: boolean } = {}
): string {
  const tier = Math.floor(value / 10);
  const sub = value % 10;

  const name = RANK_NAMES[tier];
  if (!name) return "Unknown";

  if (includeSubrank && sub >= 1 && sub <= 6) {
    return `${name} ${sub}`;
  }

  return name;
}

export function steamId3ToSteamId64(steamId3: string | number): string | null {
  if (steamId3 == null || steamId3 === "") return null;

  const idString = steamId3.toString().trim();
  if (!/^\d+$/.test(idString)) {
    console.warn(`Invalid SteamID3: must be numeric, got ${steamId3}`);
    return null;
  }

  try {
    const accountId = BigInt(idString);
    const steamId64 = BigInt("76561197960265728") + accountId;
    return steamId64.toString();
  } catch (error) {
    console.warn(`Error converting SteamID3: ${steamId3}`, error);
    return null;
  }
}
