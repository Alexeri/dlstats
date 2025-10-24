import {
  HeroAsset,
  HeroCounterStat,
  HeroWinRate,
  Item,
  TieredHeroData,
} from "@/lib/types";
import { generateTierList, resolveTimeframeToUnix } from "@/lib/utils";
import { QueryClient } from "@tanstack/react-query";

export async function getHeroWinRate(
  rank?: string,
  timeframe?: string
): Promise<HeroWinRate[]> {
  const minUnixTimestamp = resolveTimeframeToUnix(timeframe);

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
  const res = await fetch(
    "https://assets.deadlock-api.com/v2/heroes?only_active=1",
    {
      cache: "no-store",
    }
  );

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
        staleTime: 1000 * 60 * 60 * 24,
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

export async function getItemStatsByHero({
  hero_id,
  min_average_badge,
  timeframe,
}: {
  hero_id: number;
  min_average_badge: string;
  timeframe: string;
}) {
  const minUnixTimestamp = resolveTimeframeToUnix(timeframe);
  const params = new URLSearchParams({
    hero_id: String(hero_id),
    min_average_badge: String(min_average_badge),
    min_unix_timestamp: String(minUnixTimestamp),
  });

  const url = `https://api.deadlock-api.com/v1/analytics/item-stats?${params.toString()}`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch hero stats: ${res.status}`);
  }

  return res.json();
}

export async function getItemsBySlotType(
  slotType: "weapon" | "vitality" | "spirit"
): Promise<Item[]> {
  const res = await fetch(
    `https://assets.deadlock-api.com/v2/items/by-slot-type/${slotType}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch ${slotType} items`);
  }

  const data = await res.json();
  return data;
}

export async function getAllItems(): Promise<Item[]> {
  const [weapon, vitality, spirit] = await Promise.all([
    getItemsBySlotType("weapon"),
    getItemsBySlotType("vitality"),
    getItemsBySlotType("spirit"),
  ]);

  return [...weapon, ...vitality, ...spirit];
}

export async function getHeroCounters({
  min_average_badge,
  timeframe,
  min_matches = 20,
  same_lane_filter = false,
}: {
  min_average_badge: string;
  timeframe: string;
  min_matches?: number;
  same_lane_filter?: boolean;
}): Promise<HeroCounterStat[]> {
  const min_unix_timestamp = resolveTimeframeToUnix(timeframe);

  const url = new URL(
    "https://api.deadlock-api.com/v1/analytics/hero-counter-stats"
  );
  url.searchParams.set("min_average_badge", min_average_badge);
  url.searchParams.set("min_unix_timestamp", min_unix_timestamp.toString());
  url.searchParams.set("min_matches", min_matches.toString());
  url.searchParams.set("same_lane_filter", same_lane_filter ? "true" : "false");

  const res = await fetch(url.toString());

  if (!res.ok) throw new Error("Failed to fetch hero counters");
  const data = (await res.json()) as HeroCounterStat[];
  return data;
}
