import { CombinedHeroData, HeroAsset, Item, TieredHeroData } from "@/lib/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHeroName(name: string): string {
  return name.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
}

export function unformatHeroName(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\band\b/g, "&");
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

      const winRatePercentage = (winRate * 100).toFixed(2) + "%";

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

  const placeholderAbility: Item = {
    id: -1,
    class_name: "",
    name: "Unknown Ability",
    image_webp: "",
    description: { desc: "-", t2_desc: "-", t3_desc: "-" },
    properties: {
      AbilityCastRange: { value: "-", label: "Cast Range", icon: "", postfix: "" },
      AbilityCharges: { value: "-", label: "Charges", icon: "" },
      AbilityCooldown: { value: "-", label: "Cooldown", icon: "", postfix: "" },
      AbilityDuration: { value: "-", label: "Duration", icon: "", postfix: "" },
      Damage: { value: "-", label: "Damage", icon: "" },
    },
  };

  return signatureKeys.map(
    (sig) =>
      abilities.find((ability) => ability.class_name === sig) || {
        ...placeholderAbility,
        class_name: sig,
      }
  );
}

export function getStableTimestamps() {
  const now = new Date();

  // Normalize to UTC midnight
  const midnightUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  const oneWeekAgo = new Date(midnightUTC);
  oneWeekAgo.setUTCDate(midnightUTC.getUTCDate() - 7);

  const oneMonthAgo = new Date(midnightUTC);
  oneMonthAgo.setUTCMonth(midnightUTC.getUTCMonth() - 1);

  return {
    oneWeekAgoUnix: Math.floor(oneWeekAgo.getTime() / 1000),
    oneMonthAgoUnix: Math.floor(oneMonthAgo.getTime() / 1000),
  };
}

export function resolveTimeframeToUnix(timeframe?: string): number {
  const DEFAULT_PATCH_TIMESTAMP = 1759687740; // adjust as needed

  const { oneWeekAgoUnix, oneMonthAgoUnix } = getStableTimestamps();

  switch (timeframe) {
    case "7days":
      return oneWeekAgoUnix;
    case "30days":
      return oneMonthAgoUnix;
    default:
      return DEFAULT_PATCH_TIMESTAMP;
  }
}

export function parseNumericValue(value: string | number | null | undefined): number {
  if (value == null) return 0; // handle null or undefined
  const strValue = String(value); // convert numbers or other types to string
  const numeric = strValue.replace(/[^\d.]/g, "");
  return numeric ? Number(numeric) : 0;
}

export function getWinRateClass(winRateStr: string): string {
  // Convert "53.2%" => 53.2
  const winRate = parseFloat(winRateStr.replace("%", ""));
  if (winRate >= 53) return "text-green-400";
  if (winRate >= 51.5) return "text-green-300";
  if (winRate >= 50) return "text-green-200";
  if (winRate >= 48.5) return "text-red-200";
  if (winRate > 45) return "text-red-300";
  return "text-red-400"; // <= 45
}