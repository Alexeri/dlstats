"use client";
import BorderedImage from "@/components/bordered-image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { heroQueries } from "@/lib/queries/heroes";
import { matchQueries } from "@/lib/queries/matches";
import { HeroAsset } from "@/lib/types";
import {
  calculateHeroStatsFromMatches,
  cn,
  getWinRateClass,
  HeroSummary,
} from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function PlayersHeroPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    data: matchHistory,
    isLoading: matchHistoryLoading,
    error: matchHistoryError,
  } = useQuery(matchQueries.playerHistory(id));

  const { data: heroes, isLoading: heroesLoading } = useQuery(
    heroQueries.assets(),
  );

  const heroMap = useMemo<Record<number, HeroAsset>>(() => {
    if (!heroes) return {};
    return Object.fromEntries(heroes.map((h) => [h.id, h]));
  }, [heroes]);

  const allStats: HeroSummary[] = useMemo(() => {
    if (!matchHistory || matchHistory.length === 0) return [];
    return calculateHeroStatsFromMatches(matchHistory);
  }, [matchHistory]);

  if (matchHistoryLoading || heroesLoading) {
    return (
      <div className="space-y-2 mt-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-[48px] bg-blk-700 animate-pulse rounded border border-blk-600"
          ></div>
        ))}
      </div>
    );
  }
  if (matchHistoryError)
    return <p className="text-red-400">Failed to load match history.</p>;
  if (!allStats.length)
    return <p className="text-gray-400 italic">No match data available.</p>;
  return (
    <div>
      <HeroStatsTable data={allStats} heroMap={heroMap} />
    </div>
  );
}

interface HeroStatsTableProps {
  data: ReturnType<typeof calculateHeroStatsFromMatches>;
  heroMap: Record<number, HeroAsset>;
}

function HeroStatsTable({ data, heroMap }: HeroStatsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "games", desc: true },
  ]);
  const columnHelper = createColumnHelper<(typeof data)[0]>();

  const columns = [
    columnHelper.accessor("hero_id", {
      header: "Hero",
      cell: (info) => {
        const hero = heroMap[info.getValue()];
        if (!hero) {
          return (
            <div className="flex items-center gap-2">
              <div className="size-9 bg-blk-600 rounded" />
              <span className="text-gray-400">Unknown Hero</span>
            </div>
          );
        }

        const heroSlug = hero.name.toLowerCase().replace(/\s+/g, "");

        return (
          <Link
            href={`/heroes/${heroSlug}/build`}
            className="flex items-center gap-2 hover:text-white transition"
          >
            <BorderedImage
              src={hero.images?.icon_hero_card}
              alt={hero.name}
              className="size-9"
            />
            <span className="font-semibold text-[16px] text-white">
              {hero.name}
            </span>
          </Link>
        );
      },
    }),

    columnHelper.accessor("games", {
      header: "Games",
      cell: (info) => <span className="text-gray-300">{info.getValue()}</span>,
      enableSorting: true,
    }),

    columnHelper.accessor("winRate", {
      header: "Winrate",
      cell: (info) => {
        const value = info.getValue();
        return (
          <span className={cn("font-semibold", getWinRateClass(String(value)))}>
            {value}%
          </span>
        );
      },
      enableSorting: true,
    }),

    columnHelper.accessor("kda", {
      header: "KDA",
      cell: (info) => (
        <span className="font-semibold text-gray-200">{info.getValue()}</span>
      ),
      enableSorting: true,
    }),

    columnHelper.accessor("avgKills", {
      header: "Kills",
      cell: (info) => <span className="text-gray-300">{info.getValue()}</span>,
    }),

    columnHelper.accessor("avgDeaths", {
      header: "Deaths",
      cell: (info) => <span className="text-gray-300">{info.getValue()}</span>,
    }),

    columnHelper.accessor("avgAssists", {
      header: "Assists",
      cell: (info) => <span className="text-gray-300">{info.getValue()}</span>,
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Table className="text-white border border-blk-500 rounded bg-blk-800/80">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr_1fr] bg-blk-700 border-b border-blk-500 "
          >
            <TableHead className="uppercase text-xs font-bold flex items-center text-gray-400">
              Rank
            </TableHead>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                className={cn(
                  "flex items-center uppercase text-xs font-bold cursor-pointer select-none",
                  header.column.getIsSorted() ? "text-white" : "text-gray-400",
                )}
              >
                {header.isPlaceholder
                  ? null
                  : (header.column.columnDef.header as string)}

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
        {table.getRowModel().rows.map((row, i) => (
          <TableRow
            key={row.id}
            className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr_1fr] hover:bg-blk-700 border-b border-blk-700 transition-colors last:rounded"
          >
            <TableCell className="flex items-center text-[15px]">
              {i + 1}
            </TableCell>
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                className="flex items-center text-[15px]"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
