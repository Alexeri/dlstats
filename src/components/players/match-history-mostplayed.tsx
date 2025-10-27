import BorderedImage from "@/components/bordered-image";
import { HeroAsset, HeroStats } from "@/lib/types";
import { cn, formatHeroName, getKDAColor } from "@/lib/utils";
import Link from "next/link";
import { useMemo } from "react";

interface TopHeroesProps {
  topHeroes: HeroStats[];
  heroes: HeroAsset[];
}

export default function MatchHistoryMostPlayed({
  topHeroes,
  heroes,
}: TopHeroesProps) {
  const heroMap = useMemo(
    () => Object.fromEntries(heroes.map((h) => [h.id, h])),
    [heroes]
  );

  return (
    <div className="flex flex-col  bg-blk-800 p-2 rounded border">
      <h3 className="px-1 text-md font-semibold">Most Played Heroes</h3>
      {topHeroes.map((heroStat) => {
        const hero = heroMap[heroStat.heroId];
        const kdaColor = getKDAColor(Number(heroStat.kda));

        if (!hero) return null;

        return (
          <Link
            href={`/heroes/${formatHeroName(hero.name)}/build`}
            key={heroStat.heroId}
            className="flex gap-2 items-center hover:bg-blk-700/80 px-1 py-1 rounded transition-all"
          >
            {hero.images.icon_hero_card ? (
              <>
                <BorderedImage
                  src={hero.images.icon_hero_card}
                  alt={hero.name}
                  className="size-9"
                />
              </>
            ) : (
              <div className="size-9 bg-blk-500 rounded"></div>
            )}

            <div className="flex justify-between items-center w-full text-sm ">
              <div className="flex-1">{hero.name}</div>
              <div className="flex-1 flex flex-col items-center">
                <div className={cn("font-bold", kdaColor)}>
                  {heroStat.kda} KDA
                </div>
                <div className="text-xs text-gray-300">
                  {heroStat.avgKills} / {heroStat.avgDeaths} /{" "}
                  {heroStat.avgAssists}
                </div>
              </div>
              <div className="flex-1 flex flex-col items-end">
                <div
                  className={cn("font-bold", {
                    "text-brand": heroStat.winRate >= 60,
                    "text-green-400":
                      heroStat.winRate >= 50 && heroStat.winRate < 60,
                    "text-red-400": heroStat.winRate < 50,
                  })}
                >
                  {heroStat.winRate}%
                </div>
                <div className="text-xs text-gray-300">
                  {heroStat.gamesPlayed} games
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
