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
export interface Player {
  account_id: number;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  countrycode: string;
  last_updated: number;
}

export interface MatchHistory {
  account_id: number;
  match_id: number;
  hero_id: number;
  hero_level: number;
  start_time: number;
  game_mode: number;
  match_mode: number;
  player_team: number;
  player_kills: number;
  player_deaths: number;
  player_assists: number;
  denies: number;
  net_worth: number;
  last_hits: number;
  match_duration_s: number;
  match_result: number;
  objectives_mask_team0: number;
  objectives_mask_team1: number;
  username: string;
}
export interface MatchResponse {
  match_info: MatchMetadata;
}

export interface MatchMetadata {
  average_badge_team0: number;
  average_badge_team1: number;
  duration_s: number;
  game_mode: string;
  match_id: number;
  players: MatchMetadataPlayer[];
  winning_team: number;
}
export interface MatchMetadataPlayer {
  account_id: number;
  hero_id: number;
  items: [
    {
      item_id: number;
      sold_time_s: number;
      upgrade_id: number;
    }
  ];
  player_slot: number;
  team: string | number;
  kills: number;
  deaths: number;
  assists: number;
  net_worth: number;
  last_hits: number;
  stats: [
    {
      player_damage: number;
      player_healing: number;
      boss_damage: number;
    }
  ];
}

export interface HeroStats {
  heroId: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  kda: string;
  avgKills: number;
  avgDeaths: number;
  avgAssists: number;
}
