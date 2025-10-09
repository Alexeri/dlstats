export interface HeroWinRate {
  hero_id: number;
  wins: number;
  losses: number;
  matches: number;
}

export interface HeroAsset {
  id: number;
  name: string;
  description: {
    playstyle: string;
  };
  images: { icon_hero_card: string; icon_image_small: string };
  items: {
    signature1: string;
    signature2: string;
    signature3: string;
    signature4: string;
  };
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

export interface Item {
  id: number;
  class_name: string;
  name: string;
  image_webp: string;
}
