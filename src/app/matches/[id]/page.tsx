import { getQueryClient } from "@/app/get-query-client";
import MatchPageContent from "@/components/matches/match-page-content";
import { matchQueries } from "@/lib/queries/matches";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function MatchPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  const queryClient = getQueryClient();

  await queryClient.fetchQuery(matchQueries.metadata(id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MatchPageContent matchId={id} />
    </HydrationBoundary>
  );
}
