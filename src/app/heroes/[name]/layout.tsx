import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { unformatHeroName } from "@/lib/utils";
import HeroHeader from "@/components/heroes/hero-header";
import { getQueryClient } from "@/app/get-query-client";
import {
  getHeroAbilities,
  getHeroByName,
  getTierListData,
} from "@/lib/data/heroes";

export default async function HeroLayout({
  children,
  params,
  searchParams,
}: {
  children: React.ReactNode;
  params: Promise<{ name: string }>;
  searchParams: Promise<{ rank?: string; timeframe?: string }>;
}) {
  const { name } = await params;
  const { rank = "80", timeframe = "patch" } = (await searchParams) ?? {};

  const queryClient = getQueryClient();
  const unformattedName = unformatHeroName(name);

  // prefetch shared data
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
  

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HeroHeader name={unformattedName} />
      <div className="max-w-7xl mx-auto px-4 xl:px-0 mt-4">{children}</div>
    </HydrationBoundary>
  );
}
