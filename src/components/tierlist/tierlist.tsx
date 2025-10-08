"use client";
import { getQueryClient } from "@/app/get-query-client";
import TierlistTable from "@/components/tierlist/tierlist-table";
import { getTierListData } from "@/lib/data/heroes";
import { CombinedHeroData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function Tierlist() {
  const queryClient = getQueryClient();
  const { data, isLoading, error } = useQuery<CombinedHeroData[], Error>({
    queryKey: ["tierlist"],
    queryFn: () => getTierListData(queryClient),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No data</p>;

  return (
    <>
      <div className="my-4">
        <h2 className="text-2xl text-white">Hero Tier List</h2>
      </div>
      <TierlistTable heroes={data} />
    </>
  );
}
