import BorderedImage from "@/components/bordered-image";
import { heroQueries } from "@/lib/queries/heroes";
import { MatchMetadata, MatchRecent } from "@/lib/types";
import { cn, formatDuration, formatNumber } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CircleX, Trophy } from "lucide-react";
import Link from "next/link";

interface MatchLinkProps {
  match: MatchRecent & { metadata?: MatchMetadata };
}

export default function MatchLink({ match }: MatchLinkProps) {
  const { data: heroes } = useQuery(heroQueries.assets());

  const heroMap = new Map(heroes?.map((h) => [h.id, h]) ?? []);

  const amberWinner = match.metadata?.winning_team === "Team0" ? 1 : 0;
  const team0Players = match.metadata?.players.filter(
    (p) => p.team === "Team0"
  );
  const team1Players = match.metadata?.players.filter(
    (p) => p.team === "Team1"
  );
  const team0Networth = (team0Players ?? []).reduce((sum, p) => {
    const lastStat =
      p.stats && p.stats.length > 0 ? p.stats[p.stats.length - 1] : null;
    return sum + (lastStat?.net_worth ?? 0);
  }, 0);

  const team1Networth = (team1Players ?? []).reduce((sum, p) => {
    const lastStat =
      p.stats && p.stats.length > 0 ? p.stats[p.stats.length - 1] : null;
    return sum + (lastStat?.net_worth ?? 0);
  }, 0);

  return (
    <Link
      href={`/matches/${match.match_id}`}
      className="relative p-4 rounded border border-blk-500 min-h-[182px]"
    >
      <div className="absolute inset-0 opacity-10 bg-linear-to-r from-amberhand to-sapphireflame hover:opacity-15 transition-all duration-300 rounded"></div>
      <div className="flex justify-between h-full">
        <div className="flex flex-col lg:min-w-[160px]">
          <div className="font-bold text-lg text-amberhand">The Amber Hand</div>
          <div className="flex">
            <div
              className={cn(
                "px-2 rounded text-black font-medium bg-blk-600 flex items-center gap-1 text-xs",
                {
                  "bg-green-400/15 border-green-400/30 border text-green-400":
                    amberWinner,
                  "bg-red-400/15 border-red-400/30 border text-red-400":
                    !amberWinner,
                }
              )}
            >
              {amberWinner ? <Trophy size={12} /> : <CircleX size={12} />}
              <span>{amberWinner ? "Victory" : "Defeat"}</span>
            </div>
          </div>
          <div className="flex flex-col mt-2">
            {team0Players?.map((p) => {
              const hero = heroMap.get(p.hero_id);
              return (
                <div key={p.account_id} className="text-xs text-gray-200">
                  {hero ? (
                    <div className="flex items-center gap-1">
                      <BorderedImage
                        src={hero.images.icon_hero_card}
                        alt={hero.name}
                        className="size-4"
                      />
                      <div>{hero.name}</div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <div className="size-4 bg-blk-500"></div>
                      <div>Unknown</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col items-center justify-between">
          <div className="flex items-center gap-2 justify-between bg-blk-700 p-0.5 rounded border border-blk-600 h-fit text-sm">
            <div className="bg-blk-800 px-2 py-1 rounded border border-blk-500 font-bold min-w-[45px] text-center">
              {formatNumber(team0Networth)}
            </div>
            <div className="text-[10px] text-gray-400">VS</div>
            <div className="bg-blk-800 px-2 py-1 rounded border border-blk-500 font-bold min-w-[45px] text-center">
              {formatNumber(team1Networth)}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xs text-gray-300">Game Time</div>
            <div className="text-sm font-semibold">
              {formatDuration(match.duration_s)}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xs text-gray-300">Match ID</div>
            <div className="text-sm font-semibold">{match.match_id}</div>
          </div>
        </div>
        <div className="flex flex-col items-end lg:min-w-[160px]">
          <div className="font-bold text-lg text-sapphireflame text-end">
            The Sapphire Flame
          </div>
          <div className="flex">
            <div
              className={cn(
                "px-2 rounded text-black font-medium bg-blk-600 flex items-center gap-1 text-xs",
                {
                  "bg-green-400/15 border-green-400/30 border text-green-400":
                    !amberWinner,
                  "bg-red-400/15 border-red-400/30 border text-red-400":
                    amberWinner,
                }
              )}
            >
              {!amberWinner ? <Trophy size={12} /> : <CircleX size={12} />}
              <span>{!amberWinner ? "Victory" : "Defeat"}</span>
            </div>
          </div>
          <div className="flex flex-col mt-2">
            {team1Players?.map((p) => {
              const hero = heroMap.get(p.hero_id);
              return (
                <div key={p.account_id} className="text-xs text-gray-200">
                  {hero ? (
                    <div className="flex items-center gap-1 justify-end">
                      <div>{hero.name}</div>
                      <BorderedImage
                        src={hero.images.icon_hero_card}
                        alt={hero.name}
                        className="size-4"
                      />
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Link>
  );
}
