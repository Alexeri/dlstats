import HeroOverview from "@/components/heroes/hero-overview";
import SectionHeader from "@/components/section-header";
import { Swords } from "lucide-react";

export default function HeroesPage() {
  return (
    <>
      <SectionHeader
        title="Hero Roster"
        subtitle="Browse the complete roster of heroes and discover their unique abilities."
        icon={<Swords size={50} />}
      />
      <div className="max-w-7xl mx-auto px-4 xl:px-0 min-h-[500px]">
        <HeroOverview />
      </div>
    </>
  );
}
