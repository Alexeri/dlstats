import { TieredHeroData } from "@/lib/types";
import { cn, getWinRateClass } from "@/lib/utils";

interface HeroTierStatsProps {
  heroStats?: TieredHeroData;
  tierList?: TieredHeroData[];
  isLoading: boolean;
  error: Error | null;
}

export default function HeroTierStats({
  heroStats,
  tierList,
  isLoading,
  error,
}: HeroTierStatsProps) {
  if (isLoading) return <p>Loading hero stats...</p>;
  if (error) return <p>Error loading hero stats: {error.message}</p>;
  if (!tierList || !heroStats)
    return (
      <p className="text-gray-400 text-sm">No stats available for this hero.</p>
    );

  return (
    <div
      className={cn(
        "bg-blk-800 border border-b-4 rounded py-1 grid grid-cols-5",
        heroStats.tier === "S+" && "border-b-amber-400",
        heroStats.tier === "S" && "border-b-indigo-400",
        heroStats.tier === "A" && "border-b-sky-400",
        heroStats.tier === "B" && "border-b-emerald-400",
        heroStats.tier === "C" && "border-b-orange-400",
        heroStats.tier === "D" && "border-b-rose-400"
      )}
    >
      {/* Tier */}
      <div className="flex flex-col items-center p-4">
        <span
          className={cn(
            "text-2xl font-bold",
            heroStats.tier === "S+" && "text-amber-400",
            heroStats.tier === "S" && "text-indigo-400",
            heroStats.tier === "A" && "text-sky-400",
            heroStats.tier === "B" && "text-emerald-400",
            heroStats.tier === "C" && "text-orange-400",
            heroStats.tier === "D" && "text-rose-400"
          )}
        >
          {heroStats.tier}
        </span>
        <span className="text-gray-500 text-sm">Tier</span>
      </div>

      {/* Winrate */}
      <div className="flex flex-col items-center p-4">
        <span
          className={cn(
            "text-2xl font-bold",
            getWinRateClass(heroStats.winRate)
          )}
        >
          {heroStats.winRate}
        </span>
        <span className="text-gray-500 text-sm">Winrate</span>
      </div>

      {/* Rank */}
      <div className="flex flex-col items-center p-4">
        <span className="text-2xl font-bold">
          {heroStats.rank}/{tierList.length}
        </span>
        <span className="text-gray-500 text-sm">Rank</span>
      </div>

      {/* Pickrate */}
      <div className="flex flex-col items-center p-4">
        <span className="text-2xl font-bold">{heroStats.pickRate}</span>
        <span className="text-gray-500 text-sm">Pickrate</span>
      </div>

      {/* Matches */}
      <div className="flex flex-col items-center p-4">
        <span className="text-2xl font-bold">{heroStats.matches}</span>
        <span className="text-gray-500 text-sm">Matches</span>
      </div>
    </div>
  );
}
