"use client";

import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { HeroAsset, LeaderboardPlayer } from "@/lib/types";
import BorderedImage from "@/components/bordered-image";
import { cn, getSubrankImage } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import Link from "next/link";
import { heroQueries } from "@/lib/queries/heroes";

interface LeaderboardTableProps {
  data: LeaderboardPlayer[];
  showBadgeAndHeroes?: boolean;
  heroId?: number;
}

export default function LeaderboardTable({
  data,
  showBadgeAndHeroes = true,
  heroId,
}: LeaderboardTableProps) {
  const { data: heroes } = useQuery(heroQueries.assets());

  const heroMap = useMemo(() => {
    if (!heroes) return {};
    return Object.fromEntries(heroes.map((h: HeroAsset) => [h.id, h]));
  }, [heroes]);

  const columnHelper = createColumnHelper<LeaderboardPlayer>();

  const baseColumns = [
    columnHelper.accessor("rank", {
      header: "Rank",
      cell: (info) => (
        <span className="font-semibold text-[15px] text-white">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("account_name", {
      header: "Player",
      cell: (info) => {
        const player = info.row.original;
        let heroImage: string | undefined;

        if (showBadgeAndHeroes) {
          const topHeroId = player.top_hero_ids?.[0];
          if (topHeroId && heroMap[topHeroId]) {
            heroImage = heroMap[topHeroId].images?.icon_hero_card;
          }
        } else if (heroId && heroMap[heroId]) {
          heroImage = heroMap[heroId].images?.icon_hero_card;
        }

        return (
          <div className="flex items-center gap-2">
            {heroImage ? (
              <BorderedImage
                src={heroImage}
                alt="hero"
                className="size-8 rounded"
                imageClassName="object-cover rounded"
              />
            ) : (
              <div className="size-8 bg-blk-600 text-blk-200 rounded flex items-center justify-center">
                ?
              </div>
            )}

            <span className="font-semibold text-[15px] text-white truncate max-w-[140px]">
              {player.account_name}
            </span>
          </div>
        );
      },
    }),
  ];

  const optionalColumns = [
    columnHelper.accessor("badge_level", {
      header: "Badge",
      cell: (info) => {
        const badge = info.getValue();
        if (badge == null) return <span className="text-gray-400">-</span>;
        return (
          <BorderedImage
            src={getSubrankImage(badge)}
            alt={String(badge)}
            className="size-8"
            imageClassName="object-contain p-0.5"
          />
        );
      },
    }),
    columnHelper.accessor("top_hero_ids", {
      header: "Signature Heroes",
      cell: (info) => {
        const heroIds = info.getValue();
        if (!heroIds?.length) return <span className="text-gray-400">-</span>;

        return (
          <div className="flex gap-1 justify-start">
            {heroIds.slice(0, 3).map((id) => {
              const hero = heroMap[id];
              return hero ? (
                <BorderedImage
                  key={id}
                  src={hero.images?.icon_hero_card}
                  alt={hero.name}
                  className="size-8 rounded"
                  imageClassName="rounded"
                />
              ) : (
                <div
                  key={id}
                  className="size-8 bg-blk-600 rounded flex items-center justify-center text-xs text-gray-500"
                >
                  ?
                </div>
              );
            })}
          </div>
        );
      },
    }),
  ];

  const columns = showBadgeAndHeroes
    ? [...baseColumns, ...optionalColumns]
    : baseColumns;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table className="text-white border border-blk-500 rounded bg-blk-800/80">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            className="
              grid grid-cols-[80px_2fr]
              md:grid-cols-[80px_2fr_1fr_2fr]
              bg-blk-700 border-b border-blk-500
            "
          >
            {headerGroup.headers.map((header) => {
              const id = header.column.id;
              const hiddenClass =
                id === "badge_level" || id === "top_hero_ids"
                  ? "hidden md:flex"
                  : "flex";
              return (
                <TableHead
                  key={header.id}
                  className={cn(
                    hiddenClass,
                    "items-center uppercase text-xs font-bold text-gray-400"
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {data.length === 0 ? (
          <LeaderboardSkeleton />
        ) : (
          table.getRowModel().rows.map((row) => {
            const accountId = row.original.possible_account_ids?.[0];

            const RowContent = (
              <TableRow
                key={row.id}
                className={cn(
                  "grid grid-cols-[80px_2fr] md:grid-cols-[80px_2fr_1fr_2fr]",
                  accountId
                    ? "hover:bg-blk-700 cursor-pointer"
                    : "opacity-75 cursor-default",
                  "border-b border-blk-700 transition-colors"
                )}
              >
                {row.getVisibleCells().map((cell) => {
                  const id = cell.column.id;
                  const hiddenClass =
                    id === "badge_level" || id === "top_hero_ids"
                      ? "hidden md:flex"
                      : "flex";
                  return (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        hiddenClass,
                        "items-center font-medium text-[15px] text-gray-300"
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );

            return accountId ? (
              <Link key={row.id} href={`/players/${accountId}`}>
                {RowContent}
              </Link>
            ) : (
              <div key={row.id}>{RowContent}</div>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}

function LeaderboardSkeleton() {
  return (
    <>
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[80px_2fr] border-b border-blk-700 px-3 py-2 animate-pulse items-center"
        >
          <div className="h-4 bg-blk-600 rounded w-3/4" />
          <div className="flex items-center gap-2">
            <div className="size-8 bg-blk-600 rounded" />
            <div className="h-4 bg-blk-600 rounded w-full" />
          </div>
        </div>
      ))}
    </>
  );
}
