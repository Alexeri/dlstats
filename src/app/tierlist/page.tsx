import { getQueryClient } from "@/app/get-query-client";
import Tierlist from "@/components/tierlist/tierlist";
import { heroQueries } from "@/lib/queries/heroes";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function TierlistPage({
  searchParams,
}: {
  searchParams?:Promise<{ rank?: string, timeframe?: string }>;
}) {
  const { rank = "80", timeframe = "patch" } = (await searchParams) ?? {};
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(heroQueries.assets()),
    queryClient.prefetchQuery(heroQueries.winRates(rank, timeframe)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Tierlist rank={rank} timeframe={timeframe} />
    </HydrationBoundary>
  );
}
