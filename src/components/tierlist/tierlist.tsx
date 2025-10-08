"use client";
import { getQueryClient } from "@/app/get-query-client";
import { getTierListData } from "@/lib/data/heroes";
import { CombinedHeroData} from "@/lib/types";
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
    <div>
      {data.map((hero, i) => (
        <div key={i}>
          {hero.hero_id}
          {hero.asset?.name}
        </div>
      ))}
    </div>
  );
}
