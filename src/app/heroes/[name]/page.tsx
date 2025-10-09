
import { getQueryClient } from "@/app/get-query-client";
import HeroPageContent from "@/components/heroes/hero-page";
import { getHeroAbilities, getHeroByName } from "@/lib/data/heroes";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function HeroPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const queryClient = getQueryClient();

  const hero = await queryClient.fetchQuery({
    queryKey: ["hero", name],
    queryFn: () => getHeroByName(name),
  });

  await queryClient.prefetchQuery({
    queryKey: ["abilities", hero.id],
    queryFn: () => getHeroAbilities(hero.id),
  });
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HeroPageContent name={name} />
    </HydrationBoundary>
  );
}
