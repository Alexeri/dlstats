import {
  HeroAsset,
  MatchMetadata,
  MatchMetadataPlayer,
  Player,
} from "@/lib/types";
import { cn, formatStatNumber } from "@/lib/utils";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";

interface MatchStatsProps {
  data: MatchMetadata;
  heroes: Map<number, HeroAsset>;
  players?: Map<number, Player>;
}
export default function MatchStats({ data, heroes, players }: MatchStatsProps) {
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  const sortedPlayers = [...data.players].sort(
    (a, b) => Number(a.team) - Number(b.team)
  );

  const statSections = [
    {
      title: "Core Performance",
      stats: [
        {
          key: "kills",
          label: "Kills",
          render: (p: MatchMetadataPlayer) => `${p.kills}`,
        },
        {
          key: "deaths",
          label: "Deaths",
          render: (p: MatchMetadataPlayer) => `${p.deaths}`,
        },
        {
          key: "assists",
          label: "Assists",
          render: (p: MatchMetadataPlayer) => `${p.assists}`,
        },
        {
          key: "networth",
          label: "Souls",
          render: (p: MatchMetadataPlayer) => formatStatNumber(p.net_worth),
        },
        {
          key: "cs",
          label: "CS",
          render: (p: MatchMetadataPlayer) => formatStatNumber(p.last_hits),
        },
      ],
    },
    {
      title: "Combat Stats",
      stats: [
        {
          key: "damage",
          label: "Player Damage",
          render: (p: MatchMetadataPlayer) =>
            formatStatNumber(p.stats.at(-1)?.player_damage ?? 0),
        },
        {
          key: "objective-damage",
          label: "Objective Damage",
          render: (p: MatchMetadataPlayer) =>
            formatStatNumber(p.stats.at(-1)?.boss_damage ?? 0),
        },
        {
          key: "healing",
          label: "Healing",
          render: (p: MatchMetadataPlayer) =>
            formatStatNumber(p.stats.at(-1)?.player_healing ?? 0),
        },
      ],
    },
  ];

  return (
    <>
      <div className="bg-blk-700 border border-blk-500 rounded overflow-hidden">
        <div className={`grid grid-cols-14`}>
          <div className="col-span-2" />
          {sortedPlayers.map((player) => {
            const hero = heroes.get(player.hero_id);
            const steamProfile = players?.get(player.account_id);

            return (
              <Link
                href={`/players/${player.account_id}`}
                key={player.account_id}
                className="flex flex-col items-center justify-center group"
              >
                {hero ? (
                  <div
                    className={cn(
                      "relative h-24 w-full overflow-hidden",
                      player.team === 1
                        ? "bg-amberhand/10"
                        : "bg-sapphireflame/10"
                    )}
                  >
                    <Image
                      src={hero.images.icon_hero_card}
                      alt={hero.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-all"
                    />
                    <div
                      className={cn(
                        "absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t transition-all",
                        player.team === 1
                          ? "from-amberhand/40 group-hover:from-amberhand/60"
                          : "from-sapphireflame/40 group-hover:from-sapphireflame/60"
                      )}
                    />
                  </div>
                ) : (
                  <div className="h-16 w-16 bg-blk-600 rounded" />
                )}
                <div
                  className={cn(
                    "w-full flex items-center justify-center p-1.5",
                    player.team === 1
                      ? "bg-amberhand/10 border-b-amberhand border-b-2"
                      : "bg-sapphireflame/10 border-b-sapphireflame border-b-2"
                  )}
                >
                  <div className="text-xs text-gray-200 truncate max-w-[7ch] leading-none">
                    {steamProfile?.personaname || "Unknown"}
                  </div>
                </div>
              </Link>
            );
          })}

          {/* stat sections*/}
          {statSections.map((section, sectionIdx) => (
            <Fragment key={section.title}>
              <div className="contents">
                <div
                  className={cn(
                    "font-semibold text-sm text-gray-300 bg-blk-900/60 px-3 py-1 flex items-center border-y border-blk-500 col-span-2",
                    sectionIdx === 0 ? "border-t border-blk-500" : "mt-2"
                  )}
                >
                  {section.title}
                </div>

                {/* stars on first row */}
                {sectionIdx === 0
                  ? sortedPlayers.map((p) => (
                      <div
                        key={`${p.account_id}-highlight`}
                        className={cn("flex items-center justify-center border-y border-blk-500 bg-blk-900/60",
                          highlightedId === p.account_id && "bg-yellow-100/60"
                        )}
                      >
                        <button
                          onClick={() =>
                            setHighlightedId(
                              highlightedId === p.account_id
                                ? null
                                : p.account_id
                            )
                          }
                          className={cn(
                            "transition-colors p-1 cursor-pointer",
                            highlightedId === p.account_id
                              ? "text-white"
                              : "text-gray-500 hover:text-gray-300"
                          )}
                        >
                          <Star
                            className={cn(
                              "w-4 h-4",
                              highlightedId === p.account_id && "fill-current"
                            )}
                          />
                        </button>
                      </div>
                    ))
                  : // empty placeholders for other rows
                    sortedPlayers.map((p) => (
                      <div
                        key={`${p.account_id}-${sectionIdx}-spacer`}
                        className="border-y border-blk-500 bg-blk-900/60 mt-2"
                      />
                    ))}
              </div>

              {/* section stats */}
              {section.stats.map(({ key, label, render }, i) => (
                <div key={key} className="contents group transition-all">
                  <div
                    className={cn(
                      "font-bold text-sm text-muted-foreground pl-2 flex items-center border-b border-blk-500 py-1 col-span-2 bg-blk-800 group-hover:bg-blk-700",
                      i === section.stats.length - 1 && "border-b-0"
                    )}
                  >
                    {label}
                  </div>

                  {/* player stats */}
                  {sortedPlayers.map((p) => {
                    const isHighlighted = highlightedId === p.account_id;
                    return (
                      <div
                        key={`${p.account_id}-${key}`}
                        className={cn(
                          "flex items-center justify-center text-sm border-b border-blk-500 py-1 bg-blk-800",
                          i === section.stats.length - 1 && "border-b-0",
                          !isHighlighted && "group-hover:bg-blk-700",
                          isHighlighted &&
                            "bg-amberhand/10 font-semibold border-x border-x-yellow-100 text-yellow-100"
                        )}
                      >
                        {render(p)}
                      </div>
                    );
                  })}
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
