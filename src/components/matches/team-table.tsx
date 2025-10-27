import BorderedImage from "@/components/bordered-image";
import PlayerItems from "@/components/matches/player-items";
import { Progress } from "@/components/ui/progress";
import { getAllItems } from "@/lib/data/heroes";
import { HeroAsset, MatchMetadataPlayer, Player } from "@/lib/types";
import { calculateKDA, cn, formatStatNumber, getKDAColor } from "@/lib/utils";
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
  players?: Map<number, Player>;
  heroes: Map<number, HeroAsset>;
}

export default function TeamTable({ team, players, heroes }: TeamTableProps) {
  const { data: allItems, error: itemsError } = useQuery({
    queryKey: ["items", "all"],
    queryFn: getAllItems,
    staleTime: 1000 * 60 * 60 * 24, // 24h
  });

  if (itemsError) console.warn("Failed to load items data", itemsError);

  const itemMap = useMemo(
    () => (allItems ? Object.fromEntries(allItems.map((i) => [i.id, i])) : {}),
    [allItems]
  );

  const maxDamage = Math.max(
    ...team.players.map((p) => p.stats.at(-1)?.player_damage || 0)
  );

  return (
    <div className="bg-blk-700 border border-blk-500 rounded">
      <div className="grid grid-cols-5 px-3 py-1 border-blk-500 border-b items-center">
        <div
          className={cn(
            "font-bold text-sm",
            team.name === "The Amber Hand" && "text-amberhand",
            team.name === "The Sapphire Flame" && "text-sapphireflame"
          )}
        >
          {team.name}
        </div>
        <div className="text-sm text-gray-400 text-center">KDA</div>
        <div className="text-sm text-gray-400 text-center">Items</div>
        <div className="text-sm text-gray-400 text-center">Net Worth</div>
        <div className="text-sm text-gray-400 text-center">Player Damage</div>
      </div>
      {team.players.map((player, index) => {
        const hero = heroes.get(player.hero_id);
        const dmg = player.stats.at(-1)?.player_damage || 0;
        const dmgPercent = maxDamage > 0 ? (dmg / maxDamage) * 100 : 0;
        const kdaValue = calculateKDA(
          player.kills,
          player.deaths,
          player.assists
        );
        const kdaColor = getKDAColor(parseFloat(kdaValue));

        const steamProfile = players?.get(player.account_id);
        const hasPlayerProfile = !!steamProfile;

        const content = (
          <>
            {hero ? (
              <div className="flex items-center gap-2">
                <BorderedImage
                  src={hero.images.icon_hero_card}
                  alt={hero.name}
                  className="size-10"
                />
                <div className="flex flex-col text-sm font-semibold">
                  {hasPlayerProfile ? (
                    <span className="">{steamProfile?.personaname}</span>
                  ) : (
                    <span className="text-gray-400">Unknown Player</span>
                  )}

                  <span className="text-xs text-muted-foreground">
                    {hero.name}
                  </span>
                </div>
              </div>
            ) : (
              <span>Hero Unknown</span>
            )}
            <div className="flex flex-col items-center justify-center text-sm">
              <div className={cn("font-bold", kdaColor)}>{kdaValue} KDA</div>
              <div className="text-gray-400 text-xs">
                {player.kills} / {player.deaths} / {player.assists}
              </div>
            </div>
            <div className="flex justify-center">
              <PlayerItems items={player.items} allItemsMap={itemMap} />
            </div>

            <div className="flex flex-col items-center justify-center text-sm">
              <span>{formatStatNumber(player.net_worth)} Souls</span>
              <span className="text-xs text-gray-400">
                {player.last_hits} CS
              </span>
            </div>
            <div className="flex flex-col justify-center items-center w-[10ch] justify-self-center">
              <div className="text-sm">{formatStatNumber(dmg)} DMG</div>
              <Progress
                value={dmgPercent}
                className="h-2 mt-1 rounded-xs"
                indicatorClassName={cn(
                  player.team === 0 ? "bg-amberhand" : "bg-sapphireflame"
                )}
              />
            </div>
          </>
        );

        if (hasPlayerProfile) {
          return (
            <Link
              key={index}
              href={`/players/${player.account_id}`}
              className={cn(
                "grid grid-cols-5 px-3 py-1 border-b last:border-b-0 bg-blk-800 hover:bg-blk-700 transition-colors cursor-pointer last:rounded"
              )}
            >
              {content}
            </Link>
          );
        }

        return (
          <div
            key={index}
            className={cn(
              "grid grid-cols-5 px-3 py-1 border-b last:border-b-0 bg-blk-800 transition-colors"
            )}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}
