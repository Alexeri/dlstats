import {
  CombinedHeroData,
  HeroAsset,
  HeroStats,
  Item,
  MatchHistory,
  MatchMetadataPlayer,
  MatchResponse,
  TieredHeroData,
} from "@/lib/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHeroName(name: string): string {
  return name.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
}

export function unformatHeroName(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\band\b/g, "&");
}

export function generateTierList(
  heroes: CombinedHeroData[],
  totalMatches?: number
): TieredHeroData[] {
  // Find max values for normalization
  const maxPlayRate = Math.max(...heroes.map((h) => h.matches));
  const maxWinRate = Math.max(
    ...heroes.map((h) => (h.matches ? h.wins / h.matches : 0))
  );

  const tierList: TieredHeroData[] = heroes
    .map((hero) => {
      const winRate = hero.matches ? hero.wins / hero.matches : 0;
      const playRateNormalized = normalize(hero.matches, maxPlayRate);
      const winRateNormalized = normalize(winRate, maxWinRate);

      const score = playRateNormalized * 0.1 + winRateNormalized * 0.9;

      const pickRate = totalMatches
        ? ((hero.matches / totalMatches) * 100 * 12).toFixed(1) + "%"
        : "0%";

      const winRatePercentage = (winRate * 100).toFixed(2) + "%";

      const tier = assignTier(score, winRate);

      return {
        ...hero,
        winRate: winRatePercentage,
        pickRate,
        score,
        tier,
        rank: 0, // temporary, will assign after sorting
      };
    })
    .sort((a, b) => b.score - a.score)
    .map((hero, index) => ({
      ...hero,
      rank: index + 1,
    }));

  return tierList;
}

// Normalization helper
function normalize(value: number, max: number): number {
  return max ? value / max : 0;
}

// Tier assignment helper
function assignTier(score: number, winRate: number): string {
  if (winRate < 0.45) return "D"; // Low win rate heroes forced into D
  if (score >= 0.95) return "S+";
  if (score >= 0.9) return "S";
  if (score >= 0.85) return "A";
  if (score >= 0.8) return "B";
  if (score >= 0.5) return "C";
  return "D";
}

export function getOrderedSignatures(
  hero: HeroAsset,
  abilities: Item[]
): Item[] {
  const signatureKeys = [
    hero.items.signature1,
    hero.items.signature2,
    hero.items.signature3,
    hero.items.signature4,
  ].filter(Boolean);

  const makePlaceholderAbility = (class_name: string): Item => ({
    id: -1,
    class_name,
    name: "Unknown Ability",
    cost: 0,
    is_active_item: false,
    item_tier: 1,
    activation: "",
    image_webp: "",
    description: { desc: "-", t2_desc: "-", t3_desc: "-" },
    properties: {},
  });

  return signatureKeys.map((sig) => {
    const found = abilities.find((ability) => ability.class_name === sig);
    return found ?? makePlaceholderAbility(sig);
  });
}

export function getStableTimestamps() {
  const now = new Date();

  // Normalize to UTC midnight
  const midnightUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  const oneWeekAgo = new Date(midnightUTC);
  oneWeekAgo.setUTCDate(midnightUTC.getUTCDate() - 7);

  const oneMonthAgo = new Date(midnightUTC);
  oneMonthAgo.setUTCMonth(midnightUTC.getUTCMonth() - 1);

  return {
    oneWeekAgoUnix: Math.floor(oneWeekAgo.getTime() / 1000),
    oneMonthAgoUnix: Math.floor(oneMonthAgo.getTime() / 1000),
  };
}

export function resolveTimeframeToUnix(timeframe?: string): number {
  const DEFAULT_PATCH_TIMESTAMP = 1759687740; // adjust as needed

  const { oneWeekAgoUnix, oneMonthAgoUnix } = getStableTimestamps();

  switch (timeframe) {
    case "7days":
      return oneWeekAgoUnix;
    case "30days":
      return oneMonthAgoUnix;
    default:
      return DEFAULT_PATCH_TIMESTAMP;
  }
}

export function parseNumericValue(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const num = parseFloat(value.replace(/[^\d.-]/g, ""));
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

export function getWinRateClass(winRateStr: string): string {
  // Convert "53.2%" => 53.2
  const winRate = parseFloat(winRateStr.replace("%", ""));
  if (winRate >= 53) return "text-green-400";
  if (winRate >= 51.5) return "text-green-300";
  if (winRate >= 50) return "text-green-200";
  if (winRate >= 48.5) return "text-red-200";
  if (winRate > 45) return "text-red-300";
  return "text-red-400"; // <= 45
}

export const formatEpochToDate = (epoch: number): string => {
  const date = new Date(epoch * 1000);
  return date
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+)/, "$1/$2/$3, $4:$5");
};

export const getRelativeTime = (epoch: number): string => {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  const diffInSeconds = now - epoch;

  // less than a minute
  if (diffInSeconds < 60) {
    return "just now";
  }

  // minutes
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  // hours
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  // days
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  // months
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  }

  // years
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
};

export const getMatchTimeInfo = (
  epoch: number
): {
  formattedDate: string;
  relativeTime: string;
} => {
  return {
    formattedDate: formatEpochToDate(epoch),
    relativeTime: getRelativeTime(epoch),
  };
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const calculateMatchHistoryStats = (
  history: MatchHistory[],
  topHeroCount = 3,
  matchCount?: number
) => {
  if (!history || history.length === 0)
    return {
      totalGames: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      avgKills: 0,
      avgDeaths: 0,
      avgAssists: 0,
      totalKDA: "0.0",
      topHeroes: [] as HeroStats[],
    };

  const matches = matchCount ? history.slice(0, matchCount) : history;

  let wins = 0,
    totalKills = 0,
    totalDeaths = 0,
    totalAssists = 0;

  const heroStats: Record<number, MatchHistory[]> = {};

  for (const match of matches) {
    const {
      hero_id,
      player_team,
      match_result,
      player_kills,
      player_deaths,
      player_assists,
    } = match;

    if (player_team === match_result) wins++;

    totalKills += player_kills;
    totalDeaths += player_deaths;
    totalAssists += player_assists;

    if (!heroStats[hero_id]) heroStats[hero_id] = [];
    heroStats[hero_id].push(match);
  }

  const totalGames = matches.length;
  const losses = totalGames - wins;

  const totalKDA =
    totalDeaths > 0
      ? ((totalKills + totalAssists) / totalDeaths).toFixed(1)
      : (totalKills + totalAssists).toFixed(1);

  const avgKills = +(totalKills / totalGames).toFixed(1);
  const avgDeaths = +(totalDeaths / totalGames).toFixed(1);
  const avgAssists = +(totalAssists / totalGames).toFixed(1);
  const winRate = Math.round((wins / totalGames) * 100);

  // sort heroes by most played
  const topHeroes = Object.entries(heroStats)
    .sort(([, a], [, b]) => b.length - a.length)
    .slice(0, topHeroCount)
    .map(([heroId, matches]) => getHeroStats(Number(heroId), matches));

  return {
    totalGames,
    wins,
    losses,
    winRate,
    avgKills,
    avgDeaths,
    avgAssists,
    totalKDA,
    topHeroes,
  };
};

function getHeroStats(heroId: number, matches: MatchHistory[]): HeroStats {
  const totalGames = matches.length;
  const wins = matches.filter((m) => m.player_team === m.match_result).length;
  const losses = totalGames - wins;

  const totalKills = matches.reduce((sum, m) => sum + m.player_kills, 0);
  const totalDeaths = matches.reduce((sum, m) => sum + m.player_deaths, 0);
  const totalAssists = matches.reduce((sum, m) => sum + m.player_assists, 0);

  const kda = calculateKDA(totalKills, totalDeaths, totalAssists);

  return {
    heroId,
    gamesPlayed: totalGames,
    wins,
    losses,
    winRate: Math.round((wins / totalGames) * 100),
    kda,
    avgKills: +(totalKills / totalGames).toFixed(1),
    avgDeaths: +(totalDeaths / totalGames).toFixed(1),
    avgAssists: +(totalAssists / totalGames).toFixed(1),
  };
}

export const calculateOverallWinRate = (history: MatchHistory[]) => {
  if (!history.length)
    return { winRate: 0, totalMatches: 0, wins: 0, losses: 0 };

  const totalMatches = history.length;
  const wins = history.filter(
    (match) => match.player_team === match.match_result
  ).length;
  const losses = totalMatches - wins;

  const winRate = ((wins / totalMatches) * 100).toFixed(2);

  return { winRate, totalMatches, wins, losses };
};

export function groupPlayersByTeam(match: MatchResponse | null) {
  if (!match?.match_info?.players) {
    return {
      team0: {
        players: [],
        netWorth: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
        name: "The Amber Hand",
      },
      team1: {
        players: [],
        netWorth: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
        name: "The Sapphire Flame",
      },
    };
  }

  const calculateTeamStats = (
    players: MatchMetadataPlayer[],
    teamName: string
  ) => ({
    players,
    netWorth: players.reduce((sum, p) => sum + (p.net_worth ?? 0), 0),
    kills: players.reduce((sum, p) => sum + (p.kills ?? 0), 0),
    deaths: players.reduce((sum, p) => sum + (p.deaths ?? 0), 0),
    assists: players.reduce((sum, p) => sum + (p.assists ?? 0), 0),
    name: teamName,
  });

  const team0Players = match.match_info.players.filter(
    (p) => Number(p.team) === 0
  );
  const team1Players = match.match_info.players.filter(
    (p) => Number(p.team) === 1
  );

  return {
    team0: calculateTeamStats(team0Players, "The Amber Hand"),
    team1: calculateTeamStats(team1Players, "The Sapphire Flame"),
  };
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${Math.round(num / 1_000)}k`;
  return num.toString();
}

export function formatStatNumber(num: number) {
  return new Intl.NumberFormat("en-US").format(num);
}

export function getSubrankImage(value: number): string {
  const tier = Math.floor(value / 10);
  const rank = value % 10;

  // Validate tier and rank
  if (tier < 1 || tier > 11 || rank < 1 || rank > 6) {
    throw new Error(`Invalid tier or rank: ${value}`);
  }

  return `https://assets-bucket.deadlock-api.com/assets-api-res/images/ranks/rank${tier}/badge_lg_subrank${rank}.png`;
}

export function calculateKDA(kills: number, deaths: number, assists: number) {
  const ratio = (kills + assists) / (deaths === 0 ? 1 : deaths);
  return ratio.toFixed(2);
}

export function getKDAColor(kda: number) {
  if (kda >= 5) return "text-amber-500";
  if (kda >= 4) return "text-blue-400";
  if (kda >= 3) return "text-green-400";
  return "text-gray-200";
}
