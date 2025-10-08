export interface HeroWinRate {
  hero_id: number;
  wins: number;
  losses: number;
  matches: number;
}

export interface HeroAsset {
  id: number;
  name: string;
}

export interface CombinedHeroData extends HeroWinRate {
  asset?: HeroAsset;
}
