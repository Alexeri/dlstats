import { getQueryClient } from "@/app/get-query-client";
import PlayerPage from "@/components/players/player-page";
import { getPlayersBySteamId } from "@/lib/data/players";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Players({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = getQueryClient();

  await queryClient.fetchQuery({
    queryKey: ["player", id],
    queryFn: () => getPlayersBySteamId(id),
  });
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PlayerPage id={id} />
    </HydrationBoundary>
  );
}
