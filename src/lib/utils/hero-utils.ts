import { CombinedHeroData, HeroAsset, Item, TieredHeroData } from "@/lib/types";

export function formatHeroName(name: string): string {
  return name.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
}

export function unformatHeroName(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\band\b/g, "&");
}

export function generateTierList(heroes: CombinedHeroData[], totalMatches?: number): TieredHeroData[] {
  const maxPlayRate = Math.max(...heroes.map(h => h.matches));
  const maxWinRate = Math.max(...heroes.map(h => (h.matches ? h.wins / h.matches : 0)));

  const normalize = (v: number, max: number) => (max ? v / max : 0);

  const assignTier = (score: number, winRate: number) => {
    if (winRate < 0.45) return "D";
    if (score >= 0.95) return "S+";
    if (score >= 0.91) return "S";
    if (score >= 0.88) return "A";
    if (score >= 0.85) return "B";
    if (score >= 0.82) return "C";
    return "D";
  };

  return heroes
    .map(hero => {
      const winRate = hero.matches ? hero.wins / hero.matches : 0;
      const score = normalize(hero.matches, maxPlayRate) * 0.1 + normalize(winRate, maxWinRate) * 0.9;
      return {
        ...hero,
        winRate: (winRate * 100).toFixed(2) + "%",
        pickRate: totalMatches ? ((hero.matches / totalMatches) * 100 * 12).toFixed(1) + "%" : "0%",
        score,
        tier: assignTier(score, winRate),
        rank: 0,
      };
    })
    .sort((a, b) => b.score - a.score)
    .map((hero, i) => ({ ...hero, rank: i + 1 }));
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
  ].filter(Boolean);

  const makePlaceholderAbility = (class_name: string): Item => ({
    id: -1,
    class_name,
    name: "Unknown Ability",
    cost: 0,
    is_active_item: false,
    item_tier: 1,
    activation: "",
    image_webp: "",
    description: { desc: "-", t2_desc: "-", t3_desc: "-" },
    properties: {},
  });

  return signatureKeys.map((sig) => {
    const found = abilities.find((ability) => ability.class_name === sig);
    return found ?? makePlaceholderAbility(sig);
  });
}
