"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getRankName,
  formatHeroName,
  getOrderedSignatures,
  cn,
} from "@/lib/utils";
import {
  getHeroAbilities,
  getHeroByName,
  getTierListData,
} from "@/lib/data/heroes";
import { getQueryClient } from "@/app/get-query-client";
import BorderedImage from "@/components/bordered-image";
import AbilitySection from "@/components/heroes/ability-section";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

const tabs = [
  { label: "Build", href: "build" },
  { label: "Counters", href: "counters" },
  { label: "Synergies", href: "synergies" },
  { label: "Leaderboards", href: "leaderboards" },
  { label: "Community Builds", href: "community-builds", new: true },
];

export default function HeroHeader({ name }: { name: string }) {
  const queryClient = getQueryClient();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rank = searchParams.get("rank") ?? "80";
  const timeframe = searchParams.get("timeframe") ?? "patch";

  const { data: hero } = useQuery({
    queryKey: ["hero", name],
    queryFn: () => getHeroByName(name),
  });

  const { data: abilities } = useQuery({
    queryKey: ["abilities", hero?.id],
    queryFn: () => getHeroAbilities(hero!.id),
    enabled: !!hero,
  });

  const { data: tierList } = useQuery({
    queryKey: ["tierlist", rank, timeframe],
    queryFn: () => getTierListData(queryClient, rank, timeframe),
    staleTime: 1000 * 60 * 30,
  });

  if (!hero) return null;

  const heroStats = tierList?.find(
    (h) => formatHeroName(h.asset?.name ?? "") === formatHeroName(name)
  );

  const signatureAbilities = abilities
    ? getOrderedSignatures(hero, abilities)
    : [];

  return (
    <div className="bg-gradient-to-b from-blk-800 to-blk-900 pt-8 border-b border-blk-500 shadow-2xl shadow-brand/10 px-4 xl:px-0">
      <div className="max-w-7xl mx-auto ">
        <div className="flex gap-8">
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
              "w-24 h-24 border-2 bg-blk-800",
              heroStats?.tier === "S+" && "border-amber-400 ",
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
            <div className="flex gap-4 items-end">
              <AbilitySection
                signatureAbilities={signatureAbilities}
                abilitiesLoading={!abilities}
                abilitiesError={undefined}
              />
              <span className="text-sm font-thin max-w-2xl text-gray-200 leading-4">
                {hero.description.playstyle
                  ? hero.description.playstyle
                  : "We don't know anything about this hero yet..."}
              </span>
            </div>
          </div>
        </div>
        <div className="flex pt-8 gap-4 text-gray-300 text-sm transition-all">
          {tabs.map((tab) => {
            const tabHref = `/heroes/${formatHeroName(name)}/${tab.href}`;

            const isActive = pathname === tabHref;

            return (
              <Link
                key={tab.href}
                href={tabHref}
                className={cn(
                  "relative hover:text-white cursor-pointer h-[40px] flex items-center px-3 text-sm font-medium transition-all",
                  isActive
                    ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:border-b-[3px] after:border-brand after:rounded-t-lg "
                    : "text-gray-400"
                )}
              >
                {tab.label}
                {tab.new === true ? (
                  <div className="absolute top-1 -right-4 text-brand text-xs font-bold">
                    NEW
                  </div>
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
