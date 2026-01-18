"use client";
import FilterData from "@/components/filter-data";
import TierlistTable from "@/components/tierlist/tierlist-table";
import { heroQueries } from "@/lib/queries/heroes";
import { HeroAsset, HeroWinRate, TieredHeroData } from "@/lib/types";
import { generateTierList } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export function buildTierList(
  heroStats: HeroWinRate[],
  heroAssets: HeroAsset[]
): TieredHeroData[] {
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

export default function Tierlist({
  rank = "80",
  timeframe = "patch",
}: {
  rank?: string;
  timeframe?: string;
}) {

  const {
    data: assets,
    isLoading: assetsLoading,
    error: assetsError,
  } = useQuery(heroQueries.assets());

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery(heroQueries.winRates(rank, timeframe));

  const tierList = useMemo(() => {
    if (!assets || !stats) return [];
    return buildTierList(stats, assets);
  }, [assets, stats]);

  if (assetsLoading || statsLoading) return <p>Loading...</p>;
  if (assetsError || statsError)
    return <p>Error loading tier list</p>;
  if (!tierList.length) return <p>No data</p>;

  return (
    <div className="flex flex-col gap-4 mt-4">
      <FilterData hideFilters={{ region: true }} />
      <TierlistTable heroes={tierList} />
    </div>
  );
}
