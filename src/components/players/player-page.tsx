"use client";

import BorderedImage from "@/components/bordered-image";
import MatchHistoryComponent from "@/components/players/match-history";
import MatchHistoryMostPlayed from "@/components/players/match-history-mostplayed";
import { Progress } from "@/components/ui/progress";
import { getAllHeroesAssets } from "@/lib/data/heroes";
import { getPlayersBySteamId, getPlayerMatchHistory } from "@/lib/data/players";
import {
  calculateMatchHistoryStats,
  calculateOverallWinRate,
  cn,
} from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function PlayerPage({ id }: { id: string }) {
  const {
    data: player,
    isLoading: playerLoading,
    error: playerError,
  } = useQuery({
    queryKey: ["player", id],
    queryFn: () => getPlayersBySteamId(id),
  });

  const {
    data: matchHistory,
    isLoading: matchHistoryLoading,
    error: matchHistoryError,
  } = useQuery({
    queryKey: ["player-match-history", id],
    queryFn: () => getPlayerMatchHistory(id),
  });

  const {
    data: heroes,
  } = useQuery({
    queryKey: ["hero-assets"],
    queryFn: getAllHeroesAssets,
    staleTime: 1000 * 60 * 60 * 24, // 24h
  });

  const matchStats = useMemo(() => {
    if (!matchHistory || matchHistory.length === 0) return null;
    return calculateMatchHistoryStats(matchHistory, 8);
  }, [matchHistory]);

  const overallStats = useMemo(() => {
    if (!matchHistory || matchHistory.length === 0) return null;
    return calculateOverallWinRate(matchHistory);
  }, [matchHistory]);

  if (playerLoading) return <div>Loading player data…</div>;
  if (playerError) return <div>Failed to load player data.</div>;

  return (
    <div>
      <div className="bg-blk-900 py-8">
        <div className="flex max-w-7xl mx-auto px-4 xl:px-0">
          {player && (
            <div className="flex gap-8">
              <BorderedImage
                src={player[0].avatarfull}
                alt={player[0].personaname}
                className="size-24"
                imageClassName="rounded"
              />
              <h2 className="text-4xl font-bold">{player[0].personaname}</h2>
            </div>
          )}
        </div>
      </div>
      <div className="flex max-w-7xl mx-auto px-4 xl:px-0">
        <div className="flex gap-2 w-full mt-4">
          <div className="min-w-[325px] flex flex-col gap-2">
            {overallStats && (
              <>
                <div className="flex flex-col p-4 rounded bg-blk-800 border">
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
                      className="h-full"
                      indicatorClassName="bg-brand"
                    />
                  </div>
                </div>
              </>
            )}
            {matchStats && (
              <MatchHistoryMostPlayed topHeroes={matchStats.topHeroes ?? []} heroes={heroes ?? []} />
            )}
            
          </div>
          <div className="w-full flex flex-col gap-2">
            <div className="bg-blk-800 p-2 border rounded">
              <p className="font-semibold">Last 20 matches</p>
              <p className="text-gray-300 text-sm">14W-6L</p>
            </div>
            <MatchHistoryComponent
              matchHistory={matchHistory}
              heroes={heroes ?? []}
              isLoading={matchHistoryLoading}
              error={matchHistoryError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
