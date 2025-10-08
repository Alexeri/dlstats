"use client";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { CombinedHeroData } from "@/lib/types";
import { formatHeroName } from "@/lib/utils";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";

interface TierlistTableProps {
  heroes: CombinedHeroData[];
}
export default function TierlistTable({ heroes }: TierlistTableProps) {
  const columnHelper = createColumnHelper<CombinedHeroData>();

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
            <span>{hero.asset?.name ?? `Hero #${hero.hero_id}`}</span>
          </div>
        );
      },
    }),
    columnHelper.accessor("matches", { header: "Matches" }),
    columnHelper.accessor("wins", { header: "Wins" }),
    columnHelper.accessor("losses", { header: "Losses" }),
  ];
  const table = useReactTable({
    data: heroes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <Table className="text-white border border-blk-500 rounded bg-blk-800/80">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            className="grid auto-cols-fr grid-flow-col  hover:bg-blk-700 bg-blk-700 border-b-blk-500"
          >
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="text-white flex items-center uppercase text-xs font-bold"
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
      <TableBody className="">
        {table.getRowModel().rows.map((row) => {
          const hero = row.original;

          return (
            <Link
              href={`/heroes/${formatHeroName(hero.asset?.name ?? "")}`}
              key={row.id}
            >
              <TableRow className="grid auto-cols-fr grid-flow-col hover:bg-blk-700 border-b border-blk-700 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="flex items-center">
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
