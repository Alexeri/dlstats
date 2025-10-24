"use client";

import { useParams } from "next/navigation";
import {
  cn,
  formatHeroName,
  getWinRateClass,
  unformatHeroName,
} from "@/lib/utils";
import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BorderedImage from "@/components/bordered-image";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { HeroAsset, HeroCounterStat } from "@/lib/types";
import Link from "next/link";

interface EnrichedHeroCounter {
  enemy_hero_name: string;
  enemy_hero_icon?: string;
  winrate: string;
  matches_played: number;
}

interface HeroCountersTableProps {
  title: string;
  subtitle?: string;
  heroes: HeroAsset[];
  counters: HeroCounterStat[];
}

export default function HeroCountersTable({
  title,
  subtitle,
  heroes,
  counters,
}: HeroCountersTableProps) {
  const params = useParams();
  const name = unformatHeroName(params.name as string);
  const currentHero = heroes?.find(
    (h) => formatHeroName(h.name) === formatHeroName(name)
  );

  const [sorting, setSorting] = useState<SortingState>([
    { id: "winrate", desc: false },
  ]);

  const columnHelper = createColumnHelper<EnrichedHeroCounter>();

  const columns = [
    columnHelper.accessor("enemy_hero_name", {
      header: "Hero",
      cell: (info) => {
        const { enemy_hero_name, enemy_hero_icon } = info.row.original;
        return (
          <div className="flex items-center gap-2">
            {enemy_hero_icon ? (
              <BorderedImage
                src={enemy_hero_icon}
                alt={enemy_hero_name}
                className="size-9"
                sizes="36px"
              />
            ) : (
              <div className="size-9 bg-blk-600 rounded" />
            )}
            <span className="font-semibold text-[16px] text-white">
              {enemy_hero_name}
            </span>
          </div>
        );
      },
      enableSorting: true,
    }),

    columnHelper.accessor("winrate", {
      header: "Winrate",
      cell: (info) => {
        const winRateStr = info.getValue();
        const colorClass = cn("font-semibold", getWinRateClass(winRateStr));
        return <span className={colorClass}>{winRateStr}</span>;
      },
      enableSorting: true,
    }),

    columnHelper.accessor("matches_played", {
      header: "Matches",
      cell: (info) => (
        <span className="text-gray-300">
          {info.getValue().toLocaleString()}
        </span>
      ),
      enableSorting: true,
    }),
  ];

  const data = useMemo(() => {
    if (!counters || !currentHero) return [];

    return counters
      .filter((c) => c.hero_id === currentHero.id)
      .map((c) => {
        const enemy = heroes.find((h) => h.id === c.enemy_hero_id);
        const winrate =
          c.matches_played > 0
            ? ((c.wins / c.matches_played) * 100).toFixed(1) + "%"
            : "0.0%";

        return {
          enemy_hero_name: enemy?.name ?? `Hero ${c.enemy_hero_id}`,
          enemy_hero_icon: enemy?.images?.icon_hero_card,
          winrate,
          matches_played: c.matches_played,
        };
      })
      .sort((a, b) => parseFloat(b.winrate) - parseFloat(a.winrate));
  }, [counters, currentHero, heroes]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="bg-blk-800 border rounded">
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 capitalize">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="grid grid-cols-3 bg-blk-700 border-y border-blk-500"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    "flex items-center uppercase text-xs font-bold cursor-pointer select-none",
                    header.column.getIsSorted() ? "text-white" : "text-gray-400"
                  )}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getIsSorted() === "asc" && (
                    <ChevronUp className="ml-1 w-3 h-3" />
                  )}
                  {header.column.getIsSorted() === "desc" && (
                    <ChevronDown className="ml-1 w-3 h-3" />
                  )}
                  {header.column.getIsSorted() === false && (
                    <ChevronsUpDown className="ml-1 w-3 h-3 text-gray-400" />
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <Link
              href={`/heroes/${formatHeroName(
                row.original.enemy_hero_name ?? ""
              )}/build`}
              key={row.id}
            >
              <TableRow className="grid grid-cols-3 hover:bg-blk-700 border-b border-blk-700 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="flex items-center text-[16px]"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            </Link>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
