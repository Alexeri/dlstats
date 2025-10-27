import BorderedImage from "@/components/bordered-image";
import MatchHistoryItems from "@/components/players/match-history-items";
import MatchHistoryTeam from "@/components/players/match-history-team";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { getAllItems } from "@/lib/data/heroes";
import { getMatchesMetadata } from "@/lib/data/matches";
import { HeroAsset, MatchHistory, MatchMetadata } from "@/lib/types";
import {
  calculateKDA,
  cn,
  formatDuration,
  getKDAColor,
  getMatchTimeInfo,
} from "@/lib/utils";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { useQuery } from "@tanstack/react-query";
import { Info } from "lucide-react";
import Link from "next/link";
import {
  CSSProperties,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

interface MatchHistoryProps {
  matchHistory?: MatchHistory[];
  heroes: HeroAsset[];
  isLoading: boolean;
  error: Error | null;
}
export default function MatchHistoryComponent({
  matchHistory,
  heroes,
  isLoading,
  error,
}: MatchHistoryProps) {
  const [visibleCount, setVisibleCount] = useState(3);
  const [, forceRender] = useReducer((x) => x + 1, 0); // force re-render for loading new matches

  const heroMap = useMemo(
    () => Object.fromEntries(heroes.map((h) => [h.id, h])),
    [heroes]
  );

  const visibleMatches = matchHistory?.slice(0, visibleCount) ?? [];
  const matchIds = visibleMatches.map((m) => m.match_id);

  const metadataCache = useRef<Map<number, MatchMetadata>>(new Map());

  const {
    data: fetchedMetadata = [],
    isFetching: metadataFetching,
    error: metadataError,
  } = useQuery({
    queryKey: ["match-metadata", matchIds],
    queryFn: () => getMatchesMetadata(matchIds),
    enabled: matchIds.length > 0,
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (!fetchedMetadata?.length) return;

    let hasNewData = false;
    for (const meta of fetchedMetadata) {
      const existing = metadataCache.current.get(meta.match_id);
      if (!existing) hasNewData = true;
      metadataCache.current.set(meta.match_id, meta);
    }

    // only re-render if something new was added
    if (hasNewData) forceRender();
  }, [fetchedMetadata]);

  const {
    data: allItems,
    isLoading: itemsLoading,
    error: itemsError,
  } = useQuery({
    queryKey: ["items", "all"],
    queryFn: getAllItems,
    staleTime: 1000 * 60 * 60 * 24, // 24h
  });

  const allItemsMap = useMemo(
    () => Object.fromEntries((allItems ?? []).map((item) => [item.id, item])),
    [allItems]
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="relative flex bg-blk-700 border border-blk-600 rounded min-h-[104px] px-2 py-1 animate-pulse transition-opacity duration-300"
          ></div>
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-red-400 text-sm">Error loading match history.</div>
    );
  }

  if (metadataError) {
    return (
      <div className="text-red-400 text-sm">Error loading match details.</div>
    );
  }

  if (!matchHistory?.length) {
    return (
      <div className="text-gray-500 italic">No match history available.</div>
    );
  }

  return (
    <div className="">
      <div className="flex flex-col gap-1">
        {visibleMatches.map((match) => {
          const matchDetail = metadataCache.current.get(match.match_id);
          const hero = heroMap[match.hero_id];
          const isWinner = match.player_team === match.match_result;
          const gradientColor = isWinner ? "#22c55e" : "#ef4444";
          const { relativeTime } = getMatchTimeInfo(match.start_time);
          const kda = calculateKDA(
            match.player_kills,
            match.player_deaths,
            match.player_assists
          );
          const kdaColor = getKDAColor(Number(kda));

          return (
            <Link
              href={`/matches/${match.match_id}`}
              key={match.match_id}
              className={cn(
                "relative flex bg-blk-700 border px-2 py-1 rounded border-l-4 min-h-[104px]",
                isWinner ? "border-l-green-400" : "border-l-red-400"
              )}
            >
              <div
                style={{ "--gradient-color": gradientColor } as CSSProperties}
                className="absolute inset-0 opacity-10 bg-[radial-gradient(500px_200px_at_top_left,var(--gradient-color),transparent)] hover:opacity-15 transition-all duration-300"
              ></div>

              <div className="flex gap-2 z-10 w-full justify-between">
                <div className="flex flex-col justify-between min-w-[100px]">
                  <div>
                    <p
                      className={cn(
                        "font-semibold text-lg",
                        isWinner ? "text-green-400" : "text-red-400"
                      )}
                    >
                      {isWinner ? "Victory" : "Defeat"}
                    </p>
                    <div className="text-xs text-gray-300">
                      {match.game_mode === 1
                        ? "Normal"
                        : match.game_mode === 2
                        ? "Ranked"
                        : match.game_mode === 3
                        ? "Co-op Bot"
                        : match.game_mode === 4
                        ? "Hero Labs"
                        : "Unknown"}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "h-[1px] w-1/2",
                      isWinner ? "bg-green-400/20" : "bg-red-400/20"
                    )}
                  ></div>
                  <div className="text-xs text-gray-300">
                    <div>{relativeTime}</div>
                    <div>{formatDuration(match.match_duration_s)}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  {hero?.images.icon_hero_card ? (
                    <BorderedImage
                      src={hero.images.icon_hero_card}
                      alt={hero.name}
                      className="size-16"
                    />
                  ) : (
                    <div className="size-12 bg-blk-600"></div>
                  )}
                </div>

                <div className="flex flex-col items-center justify-center min-w-[100px]">
                  <div className="text-lg font-bold leading-5">
                    <span>{match.player_kills}</span>
                    <span className="text-gray-400"> / </span>
                    <span className="text-red-400">{match.player_deaths}</span>
                    <span className="text-gray-400"> / </span>
                    <span>{match.player_assists}</span>
                  </div>
                  <div
                    className={cn("flex leading-5 text-sm font-bold", kdaColor)}
                  >
                    {kda} KDA
                  </div>
                </div>

                <div className="flex gap-4 items-center justify-center min-w-[428px]">
                  {metadataFetching && !matchDetail ? (
                    <div className="text-xs text-gray-400 italic">
                      Loading match details...
                    </div>
                  ) : matchDetail ? (
                    (() => {
                      const team0 = matchDetail.players.filter(
                        (p) => p.team === "Team0"
                      );
                      const team1 = matchDetail.players.filter(
                        (p) => p.team === "Team1"
                      );
                      return (
                        <>
                          <MatchHistoryItems
                            players={matchDetail.players ?? []}
                            allItemsMap={allItemsMap}
                            isLoading={itemsLoading}
                            isError={!!itemsError}
                          />
                          <div className="flex min-w-[200px] gap-4 justify-end">
                            <MatchHistoryTeam
                              players={team0}
                              heroMap={heroMap}
                            />
                            <MatchHistoryTeam
                              players={team1}
                              heroMap={heroMap}
                            />
                          </div>
                        </>
                      );
                    })()
                  ) : (
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <span className="italic">Match missing metadata</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info size={14} />
                        </TooltipTrigger>
                        <TooltipContent className="text-white text-sm bg-blk-800 px-2 py-1 rounded">Some matches may be missing metadata. Please try again later.</TooltipContent>
                      </Tooltip>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}

        {visibleCount < matchHistory.length && (
          <Button
            onClick={() => setVisibleCount((prev) => prev + 3)}
            className="bg-blk-600 hover:bg-blk-500 border px-4 py-2 rounded text-sm text-gray-200 w-full cursor-pointer"
            disabled={metadataFetching}
          >
            {metadataFetching ? "Loading..." : "Load More"}
          </Button>
        )}
      </div>
    </div>
  );
}
