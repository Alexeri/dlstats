import { CombinedHeroData, HeroAsset, Item, TieredHeroData } from "@/lib/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHeroName(name: string): string {
  return name.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
}

export function generateTierList(
  heroes: CombinedHeroData[],
  totalMatches?: number
): TieredHeroData[] {
  // Find max values for normalization
  const maxPlayRate = Math.max(...heroes.map((h) => h.matches));
  const maxWinRate = Math.max(
    ...heroes.map((h) => (h.matches ? h.wins / h.matches : 0))
  );

  const tierList: TieredHeroData[] = heroes
    .map((hero) => {
      const winRate = hero.matches ? hero.wins / hero.matches : 0;
      const playRateNormalized = normalize(hero.matches, maxPlayRate);
      const winRateNormalized = normalize(winRate, maxWinRate);

      const score = playRateNormalized * 0.1 + winRateNormalized * 0.9;

      const pickRate = totalMatches
        ? ((hero.matches / totalMatches) * 100 * 12).toFixed(1) + "%"
        : "0%";

      const winRatePercentage = (winRate * 100).toFixed(1) + "%";

      const tier = assignTier(score, winRate);

      return {
        ...hero,
        winRate: winRatePercentage,
        pickRate,
        score,
        tier,
        rank: 0, // temporary, will assign after sorting
      };
    })
    .sort((a, b) => b.score - a.score)
    .map((hero, index) => ({
      ...hero,
      rank: index + 1,
    }));

  return tierList;
}

// Normalization helper
function normalize(value: number, max: number): number {
  return max ? value / max : 0;
}

// Tier assignment helper
function assignTier(score: number, winRate: number): string {
  if (winRate < 0.45) return "D"; // Low win rate heroes forced into D
  if (score >= 0.95) return "S+";
  if (score >= 0.9) return "S";
  if (score >= 0.85) return "A";
  if (score >= 0.8) return "B";
  if (score >= 0.5) return "C";
  return "D";
}

export function getOrderedSignatures(
  hero: HeroAsset,
  abilities: Item[]
): Item[] {
  const signatureKeys = [
    hero.items.signature1,
    hero.items.signature2,
    hero.items.signature3,
    hero.items.signature4,
  ];

  const orderedSignatures = signatureKeys.map(
    (sig) =>
      abilities.find((ability) => ability.class_name === sig) || {
        id: -1, // placeholder ID
        class_name: sig,
        name: "Unknown Ability", // placeholder name
        image_webp: "",
      }
  );

  return orderedSignatures;
}
