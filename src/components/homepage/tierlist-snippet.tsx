"use client";
import { getQueryClient } from "@/app/get-query-client";
import BorderedImage from "@/components/bordered-image";
import { getTierListData } from "@/lib/data/heroes";
import { TieredHeroData } from "@/lib/types";
import { cn, formatHeroName, getWinRateClass } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Swords } from "lucide-react";
import Link from "next/link";

export default function TierlistSnippet() {
  const queryClient = getQueryClient();
  const { data, isLoading, error } = useQuery<TieredHeroData[], Error>({
    queryKey: ["tierlist", "80", "patch"],
    queryFn: () => getTierListData(queryClient, "80", "patch"),
    staleTime: 1000 * 60 * 30,
  });

  const tierlist = data?.slice(0, 6) ?? [];

  if (isLoading)
    return (
      <div className="bg-blk-800 rounded border border-blk-500 p-4 h-[373px]">
        <h3 className="flex items-center gap-1 text-lg font-semibold">
          <Swords size={18} /> Tierlist
        </h3>
        <p className="text-sm text-gray-400 mt-2">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="bg-blk-800 rounded border border-blk-500 p-4 h-[373px]">
        <h3 className="flex items-center gap-1 text-lg font-semibold">
          <Swords size={18} /> Tierlist
        </h3>
        <p className="text-sm text-red-400 mt-2">Failed to load tierlist.</p>
      </div>
    );

  return (
    <div className="bg-blk-800 rounded border border-blk-500 p-4 h-[373px]">
      <div className="flex items-center gap-1">
        <Swords size={18} />
        <h3 className="text-lg font-semibold">Tierlist</h3>
      </div>
      <div className="grid grid-cols-4 items-center text-center text-xs border-b mt-2 text-muted-foreground">
        <div>Hero</div>
        <div>Tier</div>
        <div>Winrate</div>
        <div>Pickrate</div>
      </div>
      <div className="flex flex-col">
        {tierlist.map((hero) => {
          const winrateColor = getWinRateClass(hero.winRate);
          return (
            <Link
              href={`/heroes/${formatHeroName(hero.asset?.name ?? "")}`}
              key={hero.hero_id}
              className="grid grid-cols-4 items-center text-center py-1 border-b last:opacity-60 hover:bg-blk-700 transition-all"
            >
              <div className="flex items-center gap-2">
                {hero.asset?.images?.icon_hero_card ? (
                  <BorderedImage
                    src={hero.asset.images.icon_hero_card}
                    alt={hero.asset.name}
                    className="size-8"
                  />
                ) : (
                  <div className="size-9 bg-blk-500 rounded"></div>
                )}
                <span className="text-sm">{hero.asset?.name}</span>
              </div>
              <div
            className={cn(
              "font-bold",
              hero.tier === "S+" && "text-amber-400",
              hero.tier === "S" && "text-indigo-400",
              hero.tier === "A" && "text-sky-400",
              hero.tier === "B" && "text-emerald-400",
              hero.tier === "C" && "text-orange-400",
              hero.tier === "D" && "text-rose-400"
            )}
          >
            {hero.tier}
          </div>
              <div className={cn("text-sm font-semibold", winrateColor)}>
                {hero.winRate}
              </div>
              <div className="text-sm">{hero.pickRate}</div>
            </Link>
          );
        })}
      </div>
      <div className="pt-3">
        <Link
          href="/tierlist"
          className="text-sm text-primary hover:bg-blk-700 px-2 py-1 rounded inline-flex items-center gap-1 transition-all"
        >
          View full Tierlist <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
