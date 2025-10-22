"use client";
import { getQueryClient } from "@/app/get-query-client";
import BorderedImage from "@/components/bordered-image";
import FilterData from "@/components/filter-data";
import AbilitySection from "@/components/heroes/ability-section";
import HeroItemStats from "@/components/heroes/hero-item-stats";
import HeroTierStats from "@/components/heroes/hero-tier-stats";
import {
  getHeroAbilities,
  getHeroByName,
  getItemStatsByHero,
  getTierListData,
} from "@/lib/data/heroes";
import { HeroAsset, Item, TieredHeroData } from "@/lib/types";
import {
  cn,
  formatHeroName,
  getOrderedSignatures,
  getRankName,
} from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export default function HeroPageContent({
  name,
  rank,
  timeframe,
}: {
  name: string;
  rank: string;
  timeframe: string;
}) {
  const queryClient = getQueryClient();

  const {
    data: hero,
    isLoading: heroLoading,
    error: heroError,
  } = useQuery<HeroAsset, Error>({
    queryKey: ["hero", name],
    queryFn: () => getHeroByName(name),
  });

  const {
    data: abilities,
    isLoading: abilitiesLoading,
    error: abilitiesError,
  } = useQuery<Item[], Error>({
    queryKey: ["abilities", hero?.id],
    queryFn: () => getHeroAbilities(hero!.id),
    enabled: !!hero, // only fetch when hero is loaded
  });

  const {
    data: tierList,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery<TieredHeroData[], Error>({
    queryKey: ["tierlist", rank, timeframe],
    queryFn: () => getTierListData(queryClient, rank, timeframe),
    staleTime: 1000 * 60 * 30,
  });

  const {
    data: itemStats,
    isLoading: itemStatsLoading,
    error: itemStatsError,
  } = useQuery({
    queryKey: ["item-stats", hero?.id, rank, timeframe],
    queryFn: () =>
      getItemStatsByHero({
        hero_id: hero!.id,
        min_average_badge: rank,
        timeframe: timeframe,
      }),
    enabled: !!hero,
  });

  if (heroLoading) return <p>Loading...</p>;
  if (heroError) return <p>Error loading hero: {heroError.message}</p>;
  if (!hero) return <p>No data</p>;

  let signatureAbilities: Item[] = [];
  if (abilities) {
    signatureAbilities = getOrderedSignatures(hero, abilities);
  }

  const heroStats = tierList?.find(
    (h) => formatHeroName(h.asset?.name ?? "") === formatHeroName(name)
  );

  return (
    <div>
      <div className="bg-blk-900 py-8">
        <div className="flex gap-8 max-w-7xl mx-auto px-4 xl:px-0">
          <BorderedImage
            src={hero.images.icon_hero_card}
            alt={hero.name}
            sizes="(max-width: 768px) 96px, 160px"
            letter={heroStats?.tier}
            letterClassName={cn(
              "size-6 text-black border-2 border-black",
              heroStats?.tier === "S+" && "bg-amber-400",
              heroStats?.tier === "S" && "bg-indigo-400",
              heroStats?.tier === "A" && "bg-sky-400",
              heroStats?.tier === "B" && "bg-emerald-400",
              heroStats?.tier === "C" && "bg-orange-400",
              heroStats?.tier === "D" && "bg-rose-400"
            )}
            className={cn(
              "w-24 h-24 border-2",
              heroStats?.tier === "S+" && "border-amber-400",
              heroStats?.tier === "S" && "border-indigo-400",
              heroStats?.tier === "A" && "border-sky-400",
              heroStats?.tier === "B" && "border-emerald-400",
              heroStats?.tier === "C" && "border-orange-400",
              heroStats?.tier === "D" && "border-rose-400"
            )}
          />
          <div className="flex flex-col justify-between">
            <div className="flex items-baseline gap-4">
              <h2 className="text-white text-4xl font-bold">{hero.name}</h2>
              <span className="text-3xl text-gray-400 font-medium">
                {Number(rank) === 0
                  ? "All Ranks"
                  : `${getRankName(Number(rank))} +`}{" "}
                Matches,{" "}
                {{
                  patch: "Latest Patch",
                  "7days": "Last 7 Days",
                  "30days": "Last 30 Days",
                }[timeframe] ?? "Unknown"}
              </span>
            </div>
            <span></span>
            <div className="flex gap-4 items-end">
              <AbilitySection
                signatureAbilities={signatureAbilities}
                abilitiesLoading={abilitiesLoading}
                abilitiesError={abilitiesError}
              />
              <span className="text-sm font-thin max-w-2xl text-gray-200 leading-4">
                {hero.description.playstyle}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex max-w-7xl mx-auto px-4 xl:px-0 ">
        <div className="flex flex-col gap-4 mt-4 w-full">
          <FilterData disableFilters={{ region: true }} />
          <HeroTierStats
            heroStats={heroStats}
            tierList={tierList}
            isLoading={statsLoading}
            error={statsError}
          />
          {hero && itemStats && (
            <HeroItemStats
              itemStats={itemStats}
              totalMatches={heroStats?.matches}
              isLoading={itemStatsLoading}
              error={itemStatsError}
            />
          )}
        </div>
      </div>
    </div>
  );
}
