import { getQueryClient } from "@/app/get-query-client";
import HeroPageContent from "@/components/heroes/hero-page";
import {
  getHeroAbilities,
  getHeroByName,
  getItemStatsByHero,
  getTierListData,
} from "@/lib/data/heroes";
import { unformatHeroName } from "@/lib/utils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function HeroPage({
  params,
  searchParams,
}: {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ rank?: string; timeframe?: string }>;
}) {
  const { name } = await params;
  const { rank = "80", timeframe = "patch" } = (await searchParams) ?? {};

  const queryClient = getQueryClient();

  const unformattedName = unformatHeroName(name);

  const hero = await queryClient.fetchQuery({
    queryKey: ["hero", unformattedName],
    queryFn: () => getHeroByName(unformattedName),
  });

  await queryClient.prefetchQuery({
    queryKey: ["abilities", hero.id],
    queryFn: () => getHeroAbilities(hero.id),
  });

  await queryClient.prefetchQuery({
    queryKey: ["tierlist", rank, timeframe],
    queryFn: () => getTierListData(queryClient, rank, timeframe),
  });

  await queryClient.prefetchQuery({
    queryKey: ["item-stats", hero.id, rank, timeframe],
    queryFn: () =>
      getItemStatsByHero({
        hero_id: hero.id,
        min_average_badge: rank,
        timeframe: timeframe,
      }),
  });

   
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HeroPageContent
        name={unformattedName}
        rank={rank}
        timeframe={timeframe}
      />
    </HydrationBoundary>
  );
}
