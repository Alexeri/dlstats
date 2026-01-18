import { getQueryClient } from "@/app/get-query-client";
import LeaderboardsContent from "@/components/leaderboards/leaderboards-page";
import { leaderboardsQueries } from "@/lib/queries/leaderboards";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function LeaderboardsPage({
  searchParams,
}: {
  searchParams?: Promise<{ region?: string }>;
}) {
  const { region = "Europe" } = (await searchParams) ?? {};
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(leaderboardsQueries.data(region ?? "Europe"));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LeaderboardsContent region={region} />
    </HydrationBoundary>
  );
}
