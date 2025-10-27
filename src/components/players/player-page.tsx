"use client";

import BorderedImage from "@/components/bordered-image";
import MatchHistoryComponent from "@/components/players/match-history";
import MatchHistoryMostPlayed from "@/components/players/match-history-mostplayed";
import { Progress } from "@/components/ui/progress";
import { getAllHeroesAssets } from "@/lib/data/heroes";
import { getPlayerMatchHistory } from "@/lib/data/players";
import {
  calculateMatchHistoryStats,
  calculateOverallWinRate,
  cn,
  getKDAColor,
  getWinRateClass,
} from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function PlayerPage({ id }: { id: string }) {
  const {
    data: matchHistory,
    isLoading: matchHistoryLoading,
    error: matchHistoryError,
  } = useQuery({
    queryKey: ["player-match-history", id],
    queryFn: () => getPlayerMatchHistory(id),
  });

  const { data: heroes } = useQuery({
    queryKey: ["hero-assets"],
    queryFn: getAllHeroesAssets,
    staleTime: 1000 * 60 * 60 * 24, // 24h
  });

  const matchStats = useMemo(() => {
    if (!matchHistory || matchHistory.length === 0) return null;
    return calculateMatchHistoryStats(matchHistory, 8);
  }, [matchHistory]);

  const last20 = useMemo(() => {
    if (!matchHistory || matchHistory.length === 0) return null;
    return calculateMatchHistoryStats(matchHistory, 3, 20);
  }, [matchHistory]);

  const overallStats = useMemo(() => {
    if (!matchHistory || matchHistory.length === 0) return null;
    return calculateOverallWinRate(matchHistory);
  }, [matchHistory]);

  const heroMap = new Map(heroes?.map((h) => [h.id, h]) ?? []);

  return (
    <div className="">
      <div className="flex gap-2 w-full mt-4">
        <div className="min-w-[325px] flex flex-col gap-2">
          {overallStats && (
            <>
              <div className="flex flex-col p-3 rounded bg-blk-800 border">
                <div className="flex justify-between items-baseline">
                  <div className="flex gap-1 text-xl font-semibold">
                    <span
                      className={cn("", {
                        "text-green-400": Number(overallStats.winRate) >= 50,
                        "text-red-400": Number(overallStats.winRate) < 50,
                      })}
                    >
                      {overallStats.winRate}%
                    </span>
                    <span>Winrate</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    {overallStats.wins}W - {overallStats.losses}L
                  </div>
                </div>
                <div className="relative h-2 mt-3">
                  <div
                    className="absolute top-0 bottom-0 w-[2px] bg-gray-400 z-10"
                    style={{ left: "50%" }}
                  />
                  <Progress
                    value={Number(overallStats.winRate)}
                    className="h-full rounded-xs"
                    indicatorClassName={cn(
                      "",
                      Number(overallStats.winRate) >= 50 && "bg-green-400",
                      Number(overallStats.winRate) < 50 && "bg-red-400"
                    )}
                  />
                </div>
              </div>
            </>
          )}
          {matchStats && (
            <MatchHistoryMostPlayed
              topHeroes={matchStats.topHeroes ?? []}
              heroes={heroes ?? []}
            />
          )}
        </div>
        <div className="w-full flex flex-col gap-2">
          {matchHistoryLoading ? (
            <div className="bg-blk-800 p-2 border rounded min-h-[62px] animate-pulse"></div>
          ) : (
            <div className="bg-blk-800 p-2 border rounded flex justify-between items-center">
              <div>
                <p className="font-semibold">Last 20 matches</p>
                <div className="text-gray-300 text-sm">
                  {last20?.wins}W - {last20?.losses}L
                </div>
              </div>
              <div className="flex gap-6">
                {last20?.topHeroes.map((hero, i) => {
                  const h = heroMap.get(hero.heroId);
                  const kdaColor = getKDAColor(Number(hero.kda));
                  const winrateColor = getWinRateClass(String(hero.winRate));
                  return (
                    <div key={i} className="flex gap-2 min-w-[125px]">
                      {h ? (
                        <BorderedImage
                          src={h.images.icon_hero_card}
                          alt={h.name}
                          className="size-10"
                        />
                      ) : (
                        <div className="size-10 bg-blk-600"></div>
                      )}
                      <div className="flex flex-col text-sm">
                        <div className="flex gap-1 font-bold">
                          <p className={cn("", winrateColor)}>{hero.winRate}%</p>
                          <p className="text-gray-400">{hero.wins}W-{hero.losses}L</p>
                        </div>
                        <p className={cn("", kdaColor)}>{hero.kda} KDA</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <MatchHistoryComponent
            matchHistory={matchHistory}
            heroes={heroes ?? []}
            isLoading={matchHistoryLoading}
            error={matchHistoryError}
          />
        </div>
      </div>
    </div>
  );
}
