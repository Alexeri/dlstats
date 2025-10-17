import BorderedImage from "@/components/bordered-image";
import PlayerItems from "@/components/matches/player-items";
import { Progress } from "@/components/ui/progress";
import { getAllHeroesAssets, getAllItems } from "@/lib/data/heroes";
import { MatchMetadataPlayer } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo } from "react";

interface TeamTableProps {
  team: {
    name: string;
    players: MatchMetadataPlayer[];
    netWorth: number;
    kills: number;
    deaths: number;
    assists: number;
  };
}

export default function TeamTable({ team }: TeamTableProps) {
  const {
    data: heroes,
    error: heroesError,
  } = useQuery({
    queryKey: ["hero-assets"],
    queryFn: getAllHeroesAssets,
    staleTime: 1000 * 60 * 60 * 24, // 24h
  });

  const {
    data: allItems,
    error: itemsError,
  } = useQuery({
    queryKey: ["items", "all"],
    queryFn: getAllItems,
    staleTime: 1000 * 60 * 60 * 24, // 24h
  });

  if (heroesError) console.warn("Failed to load hero data", heroesError);
  if (itemsError) console.warn("Failed to load items data", itemsError);

  const heroMap = useMemo(
    () => (heroes ? Object.fromEntries(heroes.map((h) => [h.id, h])) : {}),
    [heroes]
  );

  const itemMap = useMemo(
    () => (allItems ? Object.fromEntries(allItems.map((i) => [i.id, i])) : {}),
    [allItems]
  );

  const maxDamage = Math.max(
    ...team.players.map((p) => p.stats.at(-1)?.player_damage || 0)
  );

  return (
    <div className="bg-blk-700 border border-blk-500 rounded">
      <div className="grid grid-cols-3 px-3 py-1 border-blk-500 border-b items-center">
        <div
          className={cn(
            "font-bold text-sm",
            team.name === "The Amber Hand" && "text-amberhand",
            team.name === "The Sapphire Flame" && "text-sapphireflame"
          )}
        >
          {team.name}
        </div>
        {/* <div className="text-sm text-gray-400">
          {team.kills}/{team.deaths}/{team.assists}
        </div> */}
      </div>
      {team.players.map((player) => {
        const hero = heroMap[player.hero_id];
        const dmg = player.stats.at(-1)?.player_damage || 0;
        const dmgPercent = maxDamage > 0 ? (dmg / maxDamage) * 100 : 0;

        return (
          <Link
            href={`/players/${player.account_id}`}
            key={player.account_id}
            className="grid grid-cols-5 px-3 py-1 border-b last:border-b-0 bg-blk-800 hover:bg-blk-700 transition-colors"
          >
            {hero ? (
              <div className="flex items-center gap-2">
                <BorderedImage
                  src={hero.images.icon_hero_card}
                  alt={hero.name}
                  className="size-8"
                />
                <span className="text-sm font-semibold">{hero.name}</span>
              </div>
            ) : (
              <span>Hero {player.hero_id}</span>
            )}
            <div className="flex flex-col items-center justify-center text-sm">
              <div>
                {player.kills} / {player.deaths} / {player.assists}
              </div>
              <div>
                {(
                  (player.kills + player.assists) /
                  (player.deaths === 0 ? 1 : player.deaths)
                ).toFixed(2)}{" "}
                KDA
              </div>
            </div>
            <div className="flex justify-center">
              <PlayerItems items={player.items} allItemsMap={itemMap} />
            </div>

            <div className="flex flex-col items-center justify-center text-sm">
              <span>{player.net_worth} Souls</span>
              <span>{player.last_hits} CS</span>
            </div>
            <div className="flex flex-col justify-center items-center w-[10ch] justify-self-center">
              <div className="text-sm">{dmg} DMG</div>
              <Progress
                value={dmgPercent}
                className="h-2 mt-1"
                indicatorClassName={cn(
                  player.team === 0 ? "bg-amberhand" : "bg-sapphireflame"
                )}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
