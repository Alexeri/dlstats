"use client";
import { getAllHeroesAssets } from "@/lib/data/heroes";
import { HeroAsset } from "@/lib/types";
import { cn, formatHeroName } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

export default function HeroOverview() {
  const {
    data: heroes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hero-assets"],
    queryFn: getAllHeroesAssets,
    staleTime: 1000 * 60 * 60 * 24, // 24h
  });

  if (isLoading) return <p>Loading heroes...</p>;
  if (error) return <p>Error loading heroes.</p>;
  if (!heroes?.length) return <p>No heroes found.</p>;

  const groupedHeroes = Object.fromEntries(
    Object.entries(
      heroes?.reduce((acc, hero) => {
        const type = hero.hero_type || "Unknown";
        if (!acc[type]) acc[type] = [];
        acc[type].push(hero);
        return acc;
      }, {} as Record<string, HeroAsset[]>) || {}
    )
      .sort(([typeA], [typeB]) => typeA.localeCompare(typeB))
      .map(([type, heroes]) => [
        type,
        (heroes as HeroAsset[]).sort((a, b) => a.name.localeCompare(b.name)),
      ])
  );

  return (
    <div className="grid sm:grid-cols-2 gap-8 mt-4 bg-blk-800/40 border p-4 rounded">
      {Object.entries(groupedHeroes).map(([type, heroes]) => (
        <section key={type} className="rounded ">
          <h2 className="text-xl font-bold capitalize text-white mb-1">
            {type}
          </h2>

          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-1">
            {heroes.map((hero) => (
              <Link
                href={`/heroes/${formatHeroName(hero.name)}/build`}
                key={hero.id}
                className={cn(
                  "relative h-[100px] bg-blk-900/80 border border-blk-500 rounded group hover:shadow-xl hover:shadow-brand/20 hover:border-brand/40 hover:scale-[1.02] transition-all",
                  hero.hero_type === "assassin" && "bg-blue-600/5",
                  hero.hero_type === "brawler" && "bg-green-600/5",
                  hero.hero_type === "marksman" && "bg-orange-600/5",
                  hero.hero_type === "mystic" && "bg-violet-600/5"
                )}
              >
                <Image
                  src={hero.images.icon_hero_card}
                  alt={hero.name}
                  fill
                  className="object-cover rounded"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blk-900 from-20% rounded-b"></div>
                <div
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t  rounded-b group-hover:from-brand/80 group-hover:animate-pulse transition-all rounded",
                    hero.hero_type === "assassin" &&
                      "group-hover:from-blue-400/80",
                    hero.hero_type === "brawler" &&
                      "group-hover:from-green-400/80",
                    hero.hero_type === "marksman" &&
                      "group-hover:from-orange-400/80",
                    hero.hero_type === "mystic" &&
                      "group-hover:from-violet-400/80"
                  )}
                ></div>
                <div className="absolute bottom-1 w-full text-center drop-shadow font-bold uppercase text-xs">
                  {hero.name}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
