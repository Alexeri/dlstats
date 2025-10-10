import { getQueryClient } from "@/app/get-query-client";
import Tierlist from "@/components/tierlist/tierlist";
import { getTierListData } from "@/lib/data/heroes";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function TierlistPage({
  searchParams,
}: {
  searchParams?: { rank?: string, timeframe?: string };
}) {
  const rank = searchParams?.rank ?? "80";
  const timeframe = searchParams?.timeframe ?? "patch";
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["tierlist", rank, timeframe],
    queryFn: () => getTierListData(queryClient, rank, timeframe),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Tierlist rank={rank} timeframe={timeframe} />
    </HydrationBoundary>
  );
}
