"use client";

import { useQuery } from "@tanstack/react-query";
import { TieredHeroData } from "@/lib/types";
import {
  cn,
  getWinRateClass,
  formatHeroName,
  unformatHeroName,
  formatStatNumber,
} from "@/lib/utils";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { heroQueries } from "@/lib/queries/heroes";
import { buildTierList } from "@/components/tierlist/tierlist";

export default function HeroTierStats() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const params = useParams();
  const searchParams = useSearchParams();
  const name = unformatHeroName(params.name as string);
  const rank = searchParams.get("rank") ?? "80";
  const timeframe = searchParams.get("timeframe") ?? "patch";

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

  const tierList: TieredHeroData[] = useMemo(() => {
    if (!assets || !stats) return [];
    return buildTierList(stats, assets);
  }, [assets, stats]);


  const heroStats = tierList?.find(
    (h) => formatHeroName(h.asset?.name ?? "") === formatHeroName(name),
  );

  const showSkeleton = !hydrated || assetsLoading || statsLoading;

  if (showSkeleton) {
    return (
      <div className="bg-blk-800 border border-b-4 rounded py-1 grid grid-cols-5 animate-pulse h-24" />
    );
  }

  const error = assetsError ?? statsError;
  if (error) return <p>Error loading hero stats: {(error as Error).message}</p>;
  if (!tierList.length || !heroStats)
    return (
      <p className="text-gray-400 text-sm">No stats available for this hero.</p>
    );

  return (
    <div
      className={cn(
        "bg-blk-800 border border-b-4 rounded py-1 grid grid-cols-5",
        heroStats.tier === "S+" && "border-b-amber-400",
        heroStats.tier === "S" && "border-b-indigo-400",
        heroStats.tier === "A" && "border-b-sky-400",
        heroStats.tier === "B" && "border-b-emerald-400",
        heroStats.tier === "C" && "border-b-orange-400",
        heroStats.tier === "D" && "border-b-rose-400",
      )}
    >
      {/* Tier */}
      <div className="flex flex-col items-center p-4">
        <span
          className={cn(
            "text-2xl font-bold",
            heroStats.tier === "S+" && "text-amber-400",
            heroStats.tier === "S" && "text-indigo-400",
            heroStats.tier === "A" && "text-sky-400",
            heroStats.tier === "B" && "text-emerald-400",
            heroStats.tier === "C" && "text-orange-400",
            heroStats.tier === "D" && "text-rose-400",
          )}
        >
          {heroStats.tier}
        </span>
        <span className="text-gray-500 text-sm">Tier</span>
      </div>

      {/* Winrate */}
      <div className="flex flex-col items-center p-4">
        <span
          className={cn(
            "text-2xl font-bold",
            getWinRateClass(heroStats.winRate),
          )}
        >
          {heroStats.winRate}
        </span>
        <span className="text-gray-500 text-sm">Winrate</span>
      </div>

      {/* Rank */}
      <div className="flex flex-col items-center p-4">
        <span className="text-2xl font-bold">
          {heroStats.rank}/{tierList.length}
        </span>
        <span className="text-gray-500 text-sm">Rank</span>
      </div>

      {/* Pickrate */}
      <div className="flex flex-col items-center p-4">
        <span className="text-2xl font-bold">{heroStats.pickRate}</span>
        <span className="text-gray-500 text-sm">Pickrate</span>
      </div>

      {/* Matches */}
      <div className="flex flex-col items-center p-4">
        <span className="text-2xl font-bold">
          {formatStatNumber(heroStats.matches)}
        </span>
        <span className="text-gray-500 text-sm">Matches</span>
      </div>
    </div>
  );
}
