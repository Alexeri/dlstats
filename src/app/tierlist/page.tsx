import { getQueryClient } from "@/app/get-query-client";
import Tierlist from "@/components/tierlist/tierlist";
import { getTierListData } from "@/lib/data/heroes";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function TierlistPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["tierlist"],
    queryFn: () => getTierListData(queryClient),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Tierlist />
    </HydrationBoundary>
  );
}
