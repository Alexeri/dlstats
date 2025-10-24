"use client";
import { getQueryClient } from "@/app/get-query-client";
import FilterData from "@/components/filter-data";
import TierlistTable from "@/components/tierlist/tierlist-table";
import { getTierListData } from "@/lib/data/heroes";
import { TieredHeroData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function Tierlist({
  rank = "80",
  timeframe = "patch",
}: {
  rank?: string;
  timeframe?: string;
}) {
  const queryClient = getQueryClient();
  const { data, isLoading, error } = useQuery<TieredHeroData[], Error>({
    queryKey: ["tierlist", rank, timeframe],
    queryFn: () => getTierListData(queryClient, rank, timeframe),
    staleTime: 1000 * 60 * 30,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No data</p>;

  return (
    <div className="flex flex-col gap-4 mt-4">
      <FilterData hideFilters={{ region: true }} />
      <TierlistTable heroes={data} />
    </div>
  );
}
