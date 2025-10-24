"use client";

import FilterData from "@/components/filter-data";
import HeroTierStats from "@/components/heroes/hero-tier-stats";
import HeroItemStats from "@/components/heroes/hero-item-stats";

export default function HeroBuildPage() {
  return (
    <div className="flex flex-col gap-4 mt-4 w-full">
      <FilterData hideFilters={{ region: true }} />
      <HeroTierStats />
      <HeroItemStats />
    </div>
  );
}
