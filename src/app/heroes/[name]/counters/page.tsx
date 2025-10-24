"use client";
import FilterData from "@/components/filter-data";
import HeroCountersTable from "@/components/heroes/hero-counters";
import { getAllHeroesAssets, getHeroCounters } from "@/lib/data/heroes";
import { unformatHeroName } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";

export default function CountersPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const name = unformatHeroName(params.name as string);
  const rank = searchParams.get("rank") ?? "80";
  const timeframe = searchParams.get("timeframe") ?? "patch";

  const { data: heroes } = useQuery({
    queryKey: ["hero-assets"],
    queryFn: getAllHeroesAssets,
    staleTime: 1000 * 60 * 60 * 24,
  });

  const { data: gameCounters, isLoading: gameCountersLoading } = useQuery({
    queryKey: ["hero-counters", rank, timeframe, "game"],
    queryFn: () =>
      getHeroCounters({
        min_average_badge: rank,
        timeframe,
      }),
  });

  const { data: laneCounters, isLoading: laneCountersLoading } = useQuery({
    queryKey: ["hero-counters", rank, timeframe, "lane"],
    queryFn: () =>
      getHeroCounters({
        min_average_badge: rank,
        timeframe,
        same_lane_filter: true,
      }),
  });

  const isLoading = gameCountersLoading || laneCountersLoading;

  if (isLoading) {
    return <div className="bg-blk-800 border p-4 rounded animate-pulse h-40" />;
  }

  const uppercaseName =
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  return (
    <div className="flex flex-col gap-4">
      <FilterData hideFilters={{ region: true }} />
      <div className="grid grid-cols-2 gap-4">
        <HeroCountersTable
          title={uppercaseName + " Game Counters"}
          subtitle={`The champions listed below counter ${uppercaseName} effectively, showing higher win rates in matches against them.`}
          heroes={heroes ?? []}
          counters={gameCounters ?? []}
        />
        <HeroCountersTable
          title={uppercaseName + " Lane Counters"}
          heroes={heroes ?? []}
          subtitle={`The champions listed below have favorable lane matchups into ${uppercaseName}, based on outcomes of games where they start in the same lane. `}
          counters={laneCounters ?? []}
        />
      </div>
    </div>
  );
}
