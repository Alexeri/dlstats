"use client";
import { heroQueries } from "@/lib/queries/heroes";
import { cn, formatHeroName } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

export default function HeroOverview() {
  const { data: heroes, isLoading, error } = useQuery(heroQueries.assets());

  if (isLoading) return <p>Loading heroes...</p>;
  if (error) return <p>Error loading heroes.</p>;
  if (!heroes?.length) return <p>No heroes found.</p>;

  const sortedHeroes = [...heroes].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col gap-2 mt-4">
      <h2 className="text-2xl font-bold">Hero Overview</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-1">
        {sortedHeroes.map((hero) => (
          <Link
            href={`/heroes/${formatHeroName(hero.name)}/build`}
            key={hero.id}
            className={cn(
              "relative h-[150px] bg-blk-900/80 border border-blk-500 rounded group hover:shadow-xl hover:shadow-brand/20 hover:border-brand/40 hover:scale-[1.02] transition-all",
              hero.hero_type === "assassin" && "bg-blue-600/5",
              hero.hero_type === "brawler" && "bg-green-600/5",
              hero.hero_type === "marksman" && "bg-orange-600/5",
              hero.hero_type === "mystic" && "bg-violet-600/5",
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
                hero.hero_type === "assassin" && "group-hover:from-blue-400/50",
                hero.hero_type === "brawler" && "group-hover:from-green-400/50",
                hero.hero_type === "marksman" &&
                  "group-hover:from-orange-400/50",
                hero.hero_type === "mystic" && "group-hover:from-violet-400/50",
              )}
            ></div>
            <div className="absolute bottom-1 w-full text-center drop-shadow font-bold uppercase text-xs">
              {hero.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
