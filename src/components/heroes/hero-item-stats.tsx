import BorderedImage from "@/components/bordered-image";
import { getAllItems } from "@/lib/data/heroes";
import { EnrichedHeroItemStat, HeroItemStat } from "@/lib/types";
import { cn, getWinRateClass } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

interface HeroItemStatsProps {
  itemStats: HeroItemStat[];
  totalMatches?: number;
  isLoading: boolean;
  error: Error | null;
}

export default function HeroItemStats({
  itemStats,
  totalMatches,
  isLoading,
  error,
}: HeroItemStatsProps) {
  const containerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const {
    data: allItems,
    isLoading: itemsLoading,
    error: itemsError,
  } = useQuery({
    queryKey: ["items", "all"],
    queryFn: getAllItems,
    staleTime: 1000 * 60 * 60 * 12, // 12h
  });

  const enriched: EnrichedHeroItemStat[] =
    itemStats
      ?.map((stat) => {
        const item = allItems?.find((i) => i.id === stat.item_id);
        return item ? { ...stat, item } : null;
      })
      .filter((s): s is EnrichedHeroItemStat => s !== null) ?? [];

  const sortedByPickrate = enriched.sort((a, b) => {
    const aPickrate = totalMatches ? a.matches / totalMatches : 0;
    const bPickrate = totalMatches ? b.matches / totalMatches : 0;
    return bPickrate - aPickrate;
  });

  const grouped = sortedByPickrate.reduce(
    (acc, curr) => {
      const slot = curr.item.item_slot_type as "weapon" | "vitality" | "spirit";
      if (!acc[slot]) acc[slot] = [];
      acc[slot].push(curr);
      return acc;
    },
    {
      weapon: [] as EnrichedHeroItemStat[],
      vitality: [] as EnrichedHeroItemStat[],
      spirit: [] as EnrichedHeroItemStat[],
    }
  );

  useEffect(() => {
    Object.values(containerRefs.current).forEach((container) => {
      if (!container) return;

      const onWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaY) > 0) {
          container.scrollLeft += e.deltaY;
          e.preventDefault();
        }
      };

      container.addEventListener("wheel", onWheel, { passive: false });

      return () => container.removeEventListener("wheel", onWheel);
    });
  }, []);

  if (isLoading || itemsLoading) return <p>Loading item stats...</p>;
  if (error || itemsError)
    return <p>Error loading item stats: {(error ?? itemsError)?.message}</p>;
  if (!enriched?.length) return <p>No item stats available for this hero.</p>;

  return (
    <>
      <div className="bg-blk-800 border p-4 rounded space-y-4">
        <h3>Item Stats</h3>
        {(["weapon", "vitality", "spirit"] as const).map((type) => {
          const items = grouped[type];
          if (!items.length) return null;

          return (
            <div key={type}>
              <div className="flex bg-blk-700 p-2 rounded border">
                <div className="flex flex-col text-sm pl-2 pr-4">
                  <div
                    className={cn(
                      "flex items-center justify-center capitalize h-12",
                      type === "weapon" && "text-weapon",
                      type === "vitality" && "text-vitality",
                      type === "spirit" && "text-spirit"
                    )}
                  >
                    {type}
                  </div>
                  <div className="mt-1">
                    <div className="text-sm text-gray-400">Winrate</div>
                    <div className="text-sm text-gray-400">Pickrate</div>
                    <div className="text-sm text-gray-400">Matches</div>
                  </div>
                </div>
                <div
                  className="flex gap-3 pb-2 overflow-x-auto custom-scrollbar"
                  ref={(el) => {
                    containerRefs.current[type] = el;
                  }}
                >
                  {items.map(({ item, wins, losses }) => {
                    const total = wins + losses;
                    const winRate =
                      total > 0 ? ((wins / total) * 100).toFixed(1) : "0.0";
                    return (
                      <div key={item.id} className="flex flex-col">
                        {item.shop_image_small_webp ? (
                          <BorderedImage
                            src={item.shop_image_small_webp}
                            alt={item.name}
                            className="size-12"
                            imageClassName="rounded"
                          />
                        ) : (
                          <div className="size-12 bg-blk-600"></div>
                        )}
                        <div className="flex flex-col items-center text-sm mt-1 font-medium">
                          <p className={cn("", getWinRateClass(winRate))}>
                            {winRate}%
                          </p>
                          <p>
                            {totalMatches
                              ? ((total / totalMatches) * 100).toFixed(1)
                              : "0.0"}
                            %
                          </p>
                          <p>{total}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
