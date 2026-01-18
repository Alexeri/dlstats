import { getQueryClient } from "@/app/get-query-client";
import MatchesRecent from "@/components/matches/matches-recent";
import { matchQueries } from "@/lib/queries/matches";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function MatchesPage() {
  const queryClient = getQueryClient();
  
  await queryClient.prefetchQuery(matchQueries.recent());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MatchesRecent />
    </HydrationBoundary>
  );
}
