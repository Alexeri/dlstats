import { getQueryClient } from "@/app/get-query-client";
import PlayerHeader from "@/components/players/player-header";
import { playerQueries } from "@/lib/queries/players";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function PlayerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = getQueryClient();

  await queryClient.fetchQuery(playerQueries.getById(id));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PlayerHeader id={id}/>
      <div className="max-w-7xl mx-auto px-4 xl:px-0 mt-4">{children}</div>
    </HydrationBoundary>
  );
}
