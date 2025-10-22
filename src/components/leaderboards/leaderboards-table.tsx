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
import { getSubrankImage } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getAllHeroesAssets } from "@/lib/data/heroes";
import { useMemo } from "react";

interface LeaderboardTableProps {
  data: LeaderboardPlayer[];
}

export default function LeaderboardTable({ data }: LeaderboardTableProps) {
  const { data: heroes } = useQuery({
    queryKey: ["hero-assets"],
    queryFn: getAllHeroesAssets,
    staleTime: 1000 * 60 * 60 * 24, // 24h
  });

  const heroMap = useMemo(() => {
    if (!heroes) return {};
    return Object.fromEntries(heroes.map((h: HeroAsset) => [h.id, h]));
  }, [heroes]);

  const columnHelper = createColumnHelper<LeaderboardPlayer>();

  const columns = [
    columnHelper.accessor("rank", {
      header: "Rank",
      cell: (info) => {
        const player = info.row.original;
        return (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[15px] text-white truncate max-w-[140px]">
              {player.rank}
            </span>
          </div>
        );
      },
    }),
    columnHelper.accessor("account_name", {
      header: "Player",
      cell: (info) => {
        const player = info.row.original;
        return (
          <div className="flex items-center gap-2">
            <div className="size-8 bg-blk-600 text-blk-200 rounded flex items-center justify-center">
              ?
            </div>
            <span className="font-semibold text-[15px] text-white truncate max-w-[140px]">
              {player.account_name}
            </span>
          </div>
        );
      },
    }),
    columnHelper.accessor("badge_level", {
      header: "Badge",
      cell: (info) => {
        const player = info.row.original;
        return (
          <BorderedImage
            src={getSubrankImage(player.badge_level)}
            alt={String(player.badge_level)}
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
        if (!heroIds?.length) return <span className="text-gray-400">–</span>;

        return (
          <div className="flex gap-1 justify-start">
            {heroIds.slice(0, 3).map((id) => {
              const hero = heroMap[id];
              if (!hero)
                return (
                  <div
                    key={id}
                    className="size-8 bg-blk-600 rounded flex items-center justify-center text-xs text-gray-500"
                  >
                    ?
                  </div>
                );
              return (
                <BorderedImage
                  key={id}
                  src={hero.images?.icon_hero_card}
                  alt={hero.name}
                  className="size-8 rounded"
                  imageClassName="rounded"
                />
              );
            })}
          </div>
        );
      },
    }),
  ];

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
            className="grid grid-cols-[80px_2fr_1fr_2fr] bg-blk-700 border-b border-blk-500"
          >
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="flex items-center uppercase text-xs font-bold text-gray-400"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {table.getRowModel().rows.map((row) => {
          return (
            <TableRow
              key={row.id}
              className="grid grid-cols-[80px_2fr_1fr_2fr] hover:bg-blk-700 border-b border-blk-700 transition-colors"
            >
              {/* Cells */}
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className="flex items-center font-medium text-[15px] text-gray-300"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
