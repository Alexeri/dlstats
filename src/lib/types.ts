export interface HeroWinRate {
  hero_id: number;
  wins: number;
  losses: number;
  matches: number;
}

export interface HeroAsset {
  id: number;
  name: string;
  images: { icon_hero_card: string; icon_image_small: string };
}

export interface CombinedHeroData extends HeroWinRate {
  asset?: HeroAsset;
}

export interface TieredHeroData extends CombinedHeroData {
  winRate: string;
  pickRate: string;
  score: number;
  tier: string;
  rank: number;
}
