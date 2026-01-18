"use client";
import BorderedImage from "@/components/bordered-image";
import { heroQueries } from "@/lib/queries/heroes";
import { leaderboardsQueries } from "@/lib/queries/leaderboards";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ChartNoAxesColumnIncreasing } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function LeaderboardsSnippet() {
  const {
    data: leaderboard,
    isLoading: leaderboardLoading,
    error: leaderboardError,
  } = useQuery(leaderboardsQueries.data("Europe"));

  const { data: heroes } = useQuery(heroQueries.assets());

  const heroMap = useMemo(() => {
    if (!heroes) return {};
    return Object.fromEntries(heroes.map((h) => [h.id, h]));
  }, [heroes]);

  if (leaderboardLoading)
    return (
      <div className="bg-blk-800 rounded border border-blk-500 p-4 h-[325px]">
        <h3 className="text-lg font-semibold mb-2">Patch Notes</h3>
        <p className="text-gray-400 text-sm">Loading latest updates...</p>
      </div>
    );

  if (leaderboardError)
    return (
      <div className="bg-blk-800 rounded border border-blk-500 p-4 h-[325px]">
        <h3 className="text-lg font-semibold mb-2">Patch Notes</h3>
        <p className="text-red-400 text-sm">
          Failed to load patch notes. Please try again later.
        </p>
      </div>
    );

  const top6 = leaderboard?.slice(0, 6) ?? [];

  return (
    <div className="bg-blk-800 rounded border border-blk-500 p-4 h-[325px]">
      <div className="flex items-center gap-1">
        <ChartNoAxesColumnIncreasing size={18} />
        <h3 className="text-lg font-semibold">Leaderboards</h3>
        <span className="text-xs bg-blk-500 px-1 py-0.5 rounded text-gray-300">
          EU
        </span>
      </div>
      <div className="grid grid-cols-4 items-center text-center text-xs border-b mt-2 text-muted-foreground">
        <div>Rank</div>
        <div className="col-span-2">Player</div>
        <div>Signature Heroes</div>
      </div>
      <div className="flex flex-col">
        {top6.map((player, i) => {
          const accountId = player.possible_account_ids?.[0];
          const isLast = i === top6.length - 1;

          const RowContent = (
            <div
              className={cn(
                "grid grid-cols-4 items-center text-center py-1 border-b transition-all",
                accountId
                  ? "hover:bg-blk-700 cursor-pointer"
                  : "cursor-default",
                (!accountId || isLast) && "opacity-60",
              )}
            >
              <div>{player.rank}</div>
              <div className="col-span-2">{player.account_name}</div>
              <div className="flex items-center gap-1 justify-center">
                {player.top_hero_ids.slice(0, 3).map((id) => {
                  const hero = heroMap[id];
                  if (!hero) return null;
                  return (
                    <BorderedImage
                      key={id}
                      src={hero.images?.icon_hero_card}
                      alt={hero.name}
                      className="size-6 rounded"
                      imageClassName="rounded"
                    />
                  );
                })}
              </div>
            </div>
          );

          return accountId ? (
            <Link key={i} href={`/players/${accountId}`}>
              {RowContent}
            </Link>
          ) : (
            <div key={i}>{RowContent}</div>
          );
        })}
      </div>
      <div className="pt-3">
        <Link
          href="/leaderboards"
          className="text-sm text-primary hover:bg-blk-700 px-2 py-1 rounded inline-flex items-center gap-1 transition-all"
        >
          View full Leaderboards <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
