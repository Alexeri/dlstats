import BorderedImage from "@/components/bordered-image";
import ItemCard from "@/components/item-card";
import { buildTierList } from "@/components/tierlist/tierlist";
import { heroQueries } from "@/lib/queries/heroes";
import { itemQueries } from "@/lib/queries/items";
import {
  EnrichedHeroItemStat,
  HeroItemStat,
} from "@/lib/types";
import {
  cn,
  formatHeroName,
  formatStatNumber,
  getWinRateClass,
  unformatHeroName,
} from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";

export default function HeroItemStats() {
  const params = useParams();
  const searchParams = useSearchParams();
  const name = unformatHeroName(params.name as string);
  const rank = searchParams.get("rank") ?? "80";
  const timeframe = searchParams.get("timeframe") ?? "patch";

  const containerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [tierFilters, setTierFilters] = useState({
    weapon: "all" as number | "all",
    vitality: "all" as number | "all",
    spirit: "all" as number | "all",
  });

  const { data: hero } = useQuery(heroQueries.hero(name));

  const {
    data: allItems,
    isLoading: itemsLoading,
    error: itemsError,
  } = useQuery(itemQueries.all());

   const {
    data: itemStats,
    isLoading: itemStatsLoading,
    error: itemStatsError,
  } = useQuery<HeroItemStat[]>({
    ...itemQueries.heroStats(
      hero?.id ?? 0,
      rank,
      timeframe
    ),
    enabled: !!hero,
  });

  const { data: assets } = useQuery(
    heroQueries.assets()
  );

  const { data: winRates } = useQuery(
    heroQueries.winRates(rank, timeframe)
  );

  const tierList = useMemo(() => {
    if (!assets || !winRates) return [];
    return buildTierList(winRates, assets);
  }, [assets, winRates]);

  const isLoading = itemsLoading || itemStatsLoading;
  const error = itemsError ?? itemStatsError;

  if (isLoading) {
    return (
      <div className="bg-blk-800 border p-4 rounded space-y-4">
        <div>Item Stats</div>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 bg-blk-700 p-2 rounded border animate-pulse h-[184px]"
          >
            <div className="grid grid-cols-5 gap-2">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="h-6 bg-blk-600 rounded" />
              ))}
            </div>
            <div className="flex gap-3 mt-2 overflow-hidden">
              {[...Array(32)].map((_, j) => (
                <div key={j} className="flex flex-col items-center gap-1">
                  <div className="size-12 bg-blk-600 rounded" />
                  <div className="h-3 w-10 bg-blk-600 rounded" />
                  <div className="h-3 w-10 bg-blk-600 rounded" />
                  <div className="h-3 w-10 bg-blk-600 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  

  const enriched: EnrichedHeroItemStat[] =
    itemStats
      ?.map((stat) => {
        const item = allItems?.find((i) => i.id === stat.item_id);
        return item ? { ...stat, item } : null;
      })
      .filter((s): s is EnrichedHeroItemStat => s !== null) ?? [];

  const heroStats = tierList?.find(
    (h) => formatHeroName(h.asset?.name ?? "") === formatHeroName(name),
  );

  const totalMatches = heroStats?.matches ?? 0;

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
    },
  );
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

          const currentFilter = tierFilters[type];
          const filteredItems =
            currentFilter === "all"
              ? items
              : items.filter((s) => s.item.item_tier === currentFilter);

          return (
            <div
              key={type}
              className="flex flex-col gap-2 bg-blk-700 p-2 rounded border"
            >
              <div className="grid grid-cols-5 p-1 bg-brand/10 rounded">
                {(["all", 1, 2, 3, 4] as const).map((tier) => (
                  <button
                    key={tier}
                    onClick={() =>
                      setTierFilters((prev) => ({
                        ...prev,
                        [type]:
                          prev[type] === tier
                            ? "all"
                            : (tier as number | "all"),
                      }))
                    }
                    className={cn(
                      "px-2 py-1 text-xs rounded transition-colors cursor-pointer",
                      currentFilter === tier
                        ? "bg-brand/50 text-white "
                        : "bg-transparent hover:bg-brand/30",
                    )}
                  >
                    {tier === "all" ? "All" : `T${tier}`}
                  </button>
                ))}
              </div>
              <div className="flex ">
                <div className="flex flex-col text-sm pl-2 pr-4">
                  <div
                    className={cn(
                      "flex items-center justify-center capitalize h-12",
                      type === "weapon" && "text-weapon",
                      type === "vitality" && "text-vitality",
                      type === "spirit" && "text-spirit",
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
                    if (el) {
                      containerRefs.current[type] = el;

                      const onWheel = (e: WheelEvent) => {
                        if (Math.abs(e.deltaY) > 0) {
                          el.scrollLeft += e.deltaY;
                          e.preventDefault();
                        }
                      };
                      el.addEventListener("wheel", onWheel, { passive: false });

                      return () => el.removeEventListener("wheel", onWheel);
                    }
                  }}
                >
                  {filteredItems.map(({ item, wins, losses }) => {
                    const total = wins + losses;
                    const winRate =
                      total > 0 ? ((wins / total) * 100).toFixed(1) : "0.0";
                    return (
                      <div key={item.id} className="flex flex-col">
                        {item.shop_image_small_webp ? (
                          <>
                            <ItemCard
                              item={item}
                              trigger={
                                <div className="relative">
                                  <BorderedImage
                                    src={item.shop_image_small_webp}
                                    alt={item.name}
                                    className="size-12"
                                    imageClassName="rounded"
                                  />
                                  <div
                                    className={cn(
                                      "absolute top-[1px] right-[1px] rounded-tr rounded-bl flex items-center justify-center text-[12px] font-extrabold size-4 text-black",
                                      item.item_slot_type === "weapon"
                                        ? "bg-weapon"
                                        : item.item_slot_type === "vitality"
                                          ? "bg-vitality"
                                          : item.item_slot_type === "spirit"
                                            ? "bg-spirit"
                                            : "",
                                    )}
                                  >
                                    {item.item_tier}
                                  </div>
                                </div>
                              }
                            />
                          </>
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
                          <p>{formatStatNumber(total)}</p>
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
