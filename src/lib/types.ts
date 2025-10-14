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
  shop_image_small_webp?: string;
  item_slot_type?: string;
  description: {
    desc: string;
    t2_desc: string;
    t3_desc: string;
  };
  properties: {
    AbilityCastRange: {
      value: string;
      label: string;
      icon: string;
      postfix: string;
    };
    AbilityCharges: {
      value: string;
      label: string;
      icon: string;
    };
    AbilityCooldown: {
      value: string;
      label: string;
      icon: string;
      postfix: string;
    };
    AbilityDuration: {
      value: string;
      label: string;
      icon: string;
      postfix: string;
    };
    Damage: {
      value: string;
      label: string;
      icon: string;
    };
  };
}

export interface HeroItemStat {
  item_id: number;
  wins: number;
  losses: number;
  matches: number;
}

export interface EnrichedHeroItemStat extends HeroItemStat {
  item: Item;
}
