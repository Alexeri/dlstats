import { getQueryClient } from "@/app/get-query-client";
import PlayerPage from "@/components/players/player-page";
import { playerQueries } from "@/lib/queries/players";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Players({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = getQueryClient();

  await queryClient.fetchQuery(playerQueries.getById(id));
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PlayerPage id={id} />
    </HydrationBoundary>
  );
}
