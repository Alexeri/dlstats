import { getQueryClient } from "@/app/get-query-client";
import MatchesRecent from "@/components/matches/matches-recent";
import { getRecentMatches } from "@/lib/data/matches";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function MatchesPage() {
  const queryClient = getQueryClient();
  
  await queryClient.prefetchQuery({
    queryKey: ["matches", "recent"],
    queryFn: () => getRecentMatches(),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MatchesRecent />
    </HydrationBoundary>
  );
}
