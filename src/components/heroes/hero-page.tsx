"use client";
import { getHeroAbilities, getHeroByName } from "@/lib/data/heroes";
import { HeroAsset, Item } from "@/lib/types";
import { getOrderedSignatures } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function HeroPageContent({ name }: { name: string }) {
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

  if (heroLoading) return <p>Loading...</p>;
  if (heroError) return <p>Error loading hero: {heroError.message}</p>;
  if (!hero) return <p>No data</p>;

  let signatureAbilities: Item[] = [];
  if (abilities) {
    signatureAbilities = getOrderedSignatures(hero, abilities);
  }
  return (
    <div className="bg-blk-900 py-8">
      <div className="flex gap-8 max-w-7xl mx-auto px-4 xl:px-0">
        <div className="relative border border-blk-500 w-24 h-24 rounded">
          <Image
            src={hero.images.icon_hero_card}
            alt={hero.name}
            fill
            sizes="160px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-between">
          <h2 className="text-white text-4xl font-bold">{hero.name}</h2>
          {abilitiesLoading && <p>Loading...</p>}
          {abilitiesError && (
            <p>Error loading abilities: {abilitiesError.message}</p>
          )}
          <div className="flex gap-4 items-end">
          {abilities && (
            <ul className="flex gap-2">
              {signatureAbilities.map((ability, i) => (
                <li key={i} className="relative w-9 h-9 border border-blk-500 rounded bg-blk-700">
                  <Image
                    src={ability.image_webp}
                    alt={ability.name}
                    fill
                    className="filter brightness-0 invert opacity-80 p-1"
                  />
                </li>
              ))}
            </ul>
          )}
          <span className="text-sm font-thin max-w-2xl text-gray-200 leading-4">{hero.description.playstyle}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
