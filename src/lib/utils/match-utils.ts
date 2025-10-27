import { MatchHistory, MatchMetadataPlayer, MatchResponse, HeroStats } from "@/lib/types";

export function calculateKDA(kills: number, deaths: number, assists: number): string {
  const ratio = (kills + assists) / (deaths === 0 ? 1 : deaths);
  return ratio.toFixed(2);
}

export function getKDAColor(kda: number): string {
  if (kda >= 5) return "text-amber-500";
  if (kda >= 4) return "text-blue-400";
  if (kda >= 3) return "text-green-400";
  return "text-gray-400";
}

export function calculateMatchHistoryStats(
  history: MatchHistory[],
  topHeroCount = 3,
  matchCount?: number
) {
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
    const { hero_id, player_team, match_result, player_kills, player_deaths, player_assists } = match;

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
}

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

export function calculateOverallWinRate(history: MatchHistory[]) {
  if (!history.length)
    return { winRate: 0, totalMatches: 0, wins: 0, losses: 0 };

  const totalMatches = history.length;
  const wins = history.filter((m) => m.player_team === m.match_result).length;
  const losses = totalMatches - wins;
  const winRate = ((wins / totalMatches) * 100).toFixed(2);

  return { winRate, totalMatches, wins, losses };
}

export function groupPlayersByTeam(match: MatchResponse | null) {
  if (!match?.match_info?.players) {
    return {
      team0: { players: [], netWorth: 0, kills: 0, deaths: 0, assists: 0, name: "The Amber Hand" },
      team1: { players: [], netWorth: 0, kills: 0, deaths: 0, assists: 0, name: "The Sapphire Flame" },
    };
  }

  const calcTeam = (players: MatchMetadataPlayer[], name: string) => ({
    players,
    netWorth: players.reduce((s, p) => s + (p.net_worth ?? 0), 0),
    kills: players.reduce((s, p) => s + (p.kills ?? 0), 0),
    deaths: players.reduce((s, p) => s + (p.deaths ?? 0), 0),
    assists: players.reduce((s, p) => s + (p.assists ?? 0), 0),
    name,
  });

  const team0 = match.match_info.players.filter((p) => Number(p.team) === 0);
  const team1 = match.match_info.players.filter((p) => Number(p.team) === 1);

  return {
    team0: calcTeam(team0, "The Amber Hand"),
    team1: calcTeam(team1, "The Sapphire Flame"),
  };
}

export interface HeroSummary {
  hero_id: number;
  games: number;
  wins: number;
  losses: number;
  winRate: number;
  avgKills: number;
  avgDeaths: number;
  avgAssists: number;
  kda: string;
}

export function calculateHeroStatsFromMatches(history: MatchHistory[]): HeroSummary[] {
  if (!history || history.length === 0) return [];

  const heroMap = new Map<
    number,
    { games: number; wins: number; kills: number; deaths: number; assists: number }
  >();

  for (const match of history) {
    const { hero_id, player_team, match_result, player_kills, player_deaths, player_assists } = match;

    const isWin = player_team === match_result;
    const stats = heroMap.get(hero_id) ?? {
      games: 0,
      wins: 0,
      kills: 0,
      deaths: 0,
      assists: 0,
    };

    stats.games++;
    stats.kills += player_kills;
    stats.deaths += player_deaths;
    stats.assists += player_assists;
    if (isWin) stats.wins++;

    heroMap.set(hero_id, stats);
  }

  const summaries: HeroSummary[] = Array.from(heroMap.entries()).map(([hero_id, stats]) => {
    const losses = stats.games - stats.wins;
    const winRate = Math.round((stats.wins / stats.games) * 100);
    const avgKills = +(stats.kills / stats.games).toFixed(1);
    const avgDeaths = +(stats.deaths / stats.games).toFixed(1);
    const avgAssists = +(stats.assists / stats.games).toFixed(1);
    const kda =
      stats.deaths > 0
        ? ((stats.kills + stats.assists) / stats.deaths).toFixed(1)
        : (stats.kills + stats.assists).toFixed(1);

    return {
      hero_id,
      games: stats.games,
      wins: stats.wins,
      losses,
      winRate,
      avgKills,
      avgDeaths,
      avgAssists,
      kda,
    };
  });

  summaries.sort((a, b) => b.games - a.games);
  return summaries;
}
