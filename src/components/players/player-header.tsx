"use client";
import BorderedImage from "@/components/bordered-image";
import { SteamLogoSolid } from "@/components/icons/steam";
import { Button } from "@/components/ui/button";
import { playerQueries } from "@/lib/queries/players";
import { cn, steamId3ToSteamId64 } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Summary", href: "" },
  { label: "Heroes", href: "heroes" },
];

export default function PlayerHeader({ id }: { id: string }) {
  const pathname = usePathname();

  const {
    data: player,
    isLoading: playerLoading,
    error: playerError,
  } = useQuery(playerQueries.getById(id));

  if (playerLoading) return <div>Loading player data…</div>;
  if (playerError) return <div>Failed to load player data.</div>;

  const basePath = `/players/${id}`;
  return (
    <div className="bg-gradient-to-b from-blk-800 to-blk-900 pt-8 border-b border-blk-500 px-4 xl:px-0">
      <div className="max-w-7xl mx-auto">
        <div className="">
          {player && (
            <div className="flex gap-8">
              <BorderedImage
                src={player[0].avatarfull}
                alt={player[0].personaname}
                className="size-24"
                imageClassName="rounded"
              />
              <div className="flex flex-col justify-between">
                <h2 className="text-4xl font-bold">{player[0].personaname}</h2>

                <div className="flex items-center gap-4">
                  <Button
                    className=" bg-brand rounded text-white font-semibold disabled:cursor-not-allowed disabled:pointer-events-auto disabled:hover:bg-brand"
                    disabled
                  >
                    Update
                  </Button>
                  <Link
                    href={`https://steamcommunity.com/profiles/${steamId3ToSteamId64(
                      id,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" text-sm text-gray-200 hover:text-white transition-all"
                  >
                    <SteamLogoSolid className="size-8" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-4 pt-8 text-gray-300 text-sm transition-all">
          {tabs.map((tab, i) => {
            const tabHref =
              tab.href === "" ? basePath : `${basePath}/${tab.href}`;
            const isActive =
              pathname === tabHref ||
              (tab.href === "" && pathname === basePath);
            return (
              <Link
                href={tabHref}
                key={i}
                className={cn(
                  "relative hover:text-white cursor-pointer h-[40px] flex items-center px-3 text-sm font-medium transition-all",
                  isActive
                    ? "text-white after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:border-b-[3px] after:border-brand after:rounded-t-lg "
                    : "text-gray-400",
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
