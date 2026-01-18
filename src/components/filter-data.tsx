"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { ranks } from "@/lib/constants/ranks";
import { FilterX, ListFilter } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const REGIONS = ["Europe", "Asia", "NAmerica", "SAmerica", "Oceania"] as const;

interface FilterDataProps {
  hideFilters?: {
    region?: boolean;
    rank?: boolean;
    timeframe?: boolean;
  };
  disableFilters?: {
    region?: boolean;
    rank?: boolean;
    timeframe?: boolean;
  };
}

export default function FilterData({
  hideFilters,
  disableFilters,
}: FilterDataProps) {
  const searchParams = useSearchParams();
  const { updateSearchParam, clearAllParams } = useUpdateSearchParams();

  const currentRank = searchParams.get("rank") ?? "80";
  const currentTimeframe = searchParams.get("timeframe") ?? "patch";
  const currentRegion = searchParams.get("region") ?? "Europe";

  const hasActiveFilters =
    currentRank !== "80" ||
    currentTimeframe !== "patch" ||
    currentRegion !== "Europe";

  return (
    <div className="flex flex-col items-start gap-4 w-full sm:flex-row sm:items-center">
      <div className="flex items-center gap-2 mr-2">
        <ListFilter size={18} />
        <span className="font-semibold">Filters</span>
      </div>
      <div className="flex justify-between w-full">
        <div className="flex gap-4">
          {!hideFilters?.rank && (
            <Select
              disabled={disableFilters?.rank}
              value={currentRank}
              onValueChange={(value) => updateSearchParam("rank", value)}
            >
              <SelectTrigger className="sm:w-[160px] cursor-pointer">
                <SelectValue placeholder="Rank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0" className="cursor-pointer">
                  All Ranks
                </SelectItem>
                {ranks.map((rank) => (
                  <SelectItem
                    key={rank.value}
                    value={rank.value}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative w-6 h-6">
                        <Image
                          src={rank.url}
                          alt={rank.label}
                          fill
                          sizes="24px"
                          className="object-cover"
                        />
                      </div>
                      <span>{rank.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {!hideFilters?.timeframe && (
            <Select
              disabled={disableFilters?.timeframe}
              value={currentTimeframe}
              onValueChange={(value) => updateSearchParam("timeframe", value)}
            >
              <SelectTrigger className="sm:w-[150px] cursor-pointer">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patch" className="cursor-pointer">
                  Latest Patch
                </SelectItem>
                <SelectItem value="7days" className="cursor-pointer">
                  Last 7 Days
                </SelectItem>
                <SelectItem value="30days" className="cursor-pointer">
                  Last 30 Days
                </SelectItem>
              </SelectContent>
            </Select>
          )}
          {!hideFilters?.region && (
            <Select
              disabled={disableFilters?.region}
              value={currentRegion}
              onValueChange={(value) => updateSearchParam("region", value)}
            >
              <SelectTrigger className="w-[180px] cursor-pointer">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((region) => (
                  <SelectItem
                    key={region}
                    value={region}
                    className="cursor-pointer"
                  >
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            onClick={clearAllParams}
            className="px-4 py-2 bg-red-500/10 border-white/10 border text-red-500 rounded hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            <FilterX />
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
}
