"use client";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { TieredHeroData } from "@/lib/types";
import { cn, formatHeroName } from "@/lib/utils";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface TierlistTableProps {
  heroes: TieredHeroData[];
}

export default function TierlistTable({ heroes }: TierlistTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "tier", desc: true },
  ]);

  const columnHelper = createColumnHelper<TieredHeroData>();

  const columns = [
    columnHelper.accessor((row) => row.asset?.name ?? `Hero #${row.hero_id}`, {
      id: "hero",
      header: "Hero",
      cell: (info) => {
        const hero = info.row.original;
        return (
          <div className="flex items-center gap-2">
            {hero.asset?.images?.icon_hero_card && (
              <div className="w-9 h-9 flex items-center justify-center bg-blk-700 border border-blk-300 rounded">
                <Image
                  src={hero.asset.images.icon_image_small}
                  alt={hero.asset.name}
                  width={32}
                  height={32}
                  className="p-0.5"
                />
              </div>
            )}
            <span className="font-semibold text-[16px]">
              {hero.asset?.name ?? `Hero #${hero.hero_id}`}
            </span>
          </div>
        );
      },
      enableSorting: true,
    }),
    columnHelper.accessor("tier", {
      header: "Tier",
      cell: (info) => {
        const hero = info.row.original;
        return (
          <span
            className={cn(
              "text-lg font-bold",
              hero.tier === "S+" && "text-amber-400",
              hero.tier === "S" &&  "text-indigo-400",
              hero.tier === "A" && "text-sky-400",
              hero.tier === "B" && "text-emerald-400",
              hero.tier === "C" && "text-orange-400",
              hero.tier === "D" && "text-rose-400"
            )}
          >
            {hero.tier}
          </span>
        );
      },
      sortingFn: (a, b) => {
        const scoreA = a.original.score ?? 0;
        const scoreB = b.original.score ?? 0;
        return scoreA - scoreB;
      },
    }),
    columnHelper.accessor("winRate", { header: "Winrate", }),
    columnHelper.accessor("pickRate", { header: "Pickrate" }),
    columnHelper.accessor("matches", { header: "Matches" }),
  ];
  const table = useReactTable({
    data: heroes,
    columns,
    state: {
      sorting,
    },
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
            className="grid grid-cols-[100px_2fr_1fr_1fr_1fr_1fr] hover:bg-blk-700 bg-blk-700 border-b-blk-500"
          >
            <TableHead className="flex items-center uppercase text-xs font-bold text-gray-400 select-none">
              Rank
            </TableHead>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className={cn(
                  "flex items-center uppercase text-xs font-bold cursor-pointer select-none",
                  header.column.getIsSorted() ? "text-white" : "text-gray-400"
                )}
                onClick={header.column.getToggleSortingHandler()}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
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
      <TableBody className="">
        {table.getRowModel().rows.map((row, rowIndex) => {
          const hero = row.original;

          return (
            <Link
              href={`/heroes/${formatHeroName(hero.asset?.name ?? "")}`}
              key={row.id}
            >
              <TableRow className="grid grid-cols-[100px_2fr_1fr_1fr_1fr_1fr] hover:bg-blk-700 border-b border-blk-700 transition-colors">
                <TableCell className="flex items-center">
                  {rowIndex + 1}
                </TableCell>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="flex items-center font-semibold">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            </Link>
          );
        })}
      </TableBody>
    </Table>
  );
}
