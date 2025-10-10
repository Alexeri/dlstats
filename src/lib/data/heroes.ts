import { HeroAsset, HeroWinRate, Item, TieredHeroData } from "@/lib/types";
import { generateTierList, getStableTimestamps } from "@/lib/utils";
import { QueryClient } from "@tanstack/react-query";

export async function getHeroWinRate(
  rank?: string,
  timeframe?: string
): Promise<HeroWinRate[]> {
  const DEFAULT_PATCH_TIMESTAMP = 1759687740;

  const { oneWeekAgoUnix, oneMonthAgoUnix } = getStableTimestamps();

  let minUnixTimestamp: number;

  switch (timeframe) {
    case "7days":
      minUnixTimestamp = oneWeekAgoUnix;
      break;
    case "30days":
      minUnixTimestamp = oneMonthAgoUnix;
      break;
    default:
      minUnixTimestamp = DEFAULT_PATCH_TIMESTAMP;
      break;
  }

  const minAverageBadge = rank ? Number(rank) : 80;

  const params = new URLSearchParams({
    min_unix_timestamp: String(minUnixTimestamp),
    min_average_badge: String(minAverageBadge),
  });

  const url = `https://api.deadlock-api.com/v1/analytics/hero-stats?${params.toString()}`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch hero stats: ${res.status}`);
  }

  return res.json();
}

export async function getAllHeroesAssets(): Promise<HeroAsset[]> {
  const res = await fetch("https://assets.deadlock-api.com/v2/heroes", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch hero stats: ${res.status}`);
  }

  return res.json();
}

export async function getTierListData(
  queryClient: QueryClient,
  rank?: string,
  timeframe?: string
): Promise<TieredHeroData[]> {
  let heroAssets: HeroAsset[];

  if (queryClient) {
    heroAssets =
      queryClient.getQueryData<HeroAsset[]>(["heroes-assets"]) ??
      (await queryClient.ensureQueryData<HeroAsset[]>({
        queryKey: ["heroes-assets"],
        queryFn: getAllHeroesAssets,
      })) ??
      (await getAllHeroesAssets());
  } else {
    heroAssets = await getAllHeroesAssets();
  }

  const heroStats = await getHeroWinRate(rank, timeframe);

  const combined = heroStats.map((stat) => {
    const asset = heroAssets.find((h) => h.id === stat.hero_id);
    const winRate = stat.matches ? (stat.wins / stat.matches) * 100 : 0;
    return { ...stat, winRate, asset };
  });

  const totalMatches = heroStats.reduce(
    (total, hero) => total + hero.matches,
    0
  );

  return generateTierList(combined, totalMatches);
}

export async function getHeroByName(name: string): Promise<HeroAsset> {
  const res = await fetch(
    `https://assets.deadlock-api.com/v2/heroes/by-name/${name}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch hero: ${res.status}`);
  }

  return res.json();
}

export async function getHeroAbilities(heroId: number): Promise<Item[]> {
  const res = await fetch(
    `https://assets.deadlock-api.com/v2/items/by-hero-id/${heroId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch abilities for hero ${heroId}`);
  }

  return res.json();
}
