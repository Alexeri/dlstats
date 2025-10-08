import { CombinedHeroData, HeroAsset, HeroWinRate } from "@/lib/types";
import { QueryClient } from "@tanstack/react-query";

export async function getHeroWinRate(): Promise<HeroWinRate[]> {
  const res = await fetch(
    "https://api.deadlock-api.com/v1/analytics/hero-stats",
    {
      cache: "no-store",
    }
  );

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
  queryClient: QueryClient
): Promise<CombinedHeroData[]> {
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

  const heroStats = await getHeroWinRate();

  const combined = heroStats.map((stat) => {
    const asset = heroAssets.find((h) => h.id === stat.hero_id);
    const winRate = stat.matches ? (stat.wins / stat.matches) * 100 : 0;
    return { ...stat, winRate, asset };
  });

  return combined;
}
