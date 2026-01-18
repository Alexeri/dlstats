"use client";
import FilterData from "@/components/filter-data";
import LeaderboardTable from "@/components/leaderboards/leaderboards-table";
import { Button } from "@/components/ui/button";
import { heroQueries } from "@/lib/queries/heroes";
import { formatHeroName, unformatHeroName } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";

const PAGE_SIZE = 50;

export default function HeroLeaderboardsPage() {
  const [page, setPage] = useState(0);
  const params = useParams();
  const searchParams = useSearchParams();

  const heroParam = unformatHeroName(params.name as string);
  const region = searchParams.get("region") ?? "Europe";

  const { data: heroes } = useQuery(heroQueries.assets());

  const currentHero = heroes?.find(
    (h) => formatHeroName(h.name) === formatHeroName(heroParam),
  );
  const heroId = currentHero?.id;

  const { data: leaderboard, isLoading: leaderboardLoading, error: leaderboardError } = useQuery({
    ...heroQueries.leaderboard(heroId!, region),
    enabled: !!heroId,
  });

  if (leaderboardError)
    return (
      <p className="text-red-400">
        Error loading leaderboard: {(leaderboardError as Error).message}
      </p>
    );
  if (
    heroId &&
    !leaderboardLoading &&
    !leaderboardError &&
    leaderboard?.length === 0
  ) {
    return (
      <p className="text-gray-400 italic">No leaderboard data available.</p>
    );
  }

  const totalPages = leaderboard
    ? Math.ceil(leaderboard.length / PAGE_SIZE)
    : 1;
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageData = leaderboard?.slice(start, end) ?? [];

  return (
    <div>
      <div className="flex flex-col gap-4 mt-4">
        <FilterData hideFilters={{ rank: true, timeframe: true }} />
        <LeaderboardTable
          data={pageData}
          showBadgeAndHeroes={false}
          heroId={heroId}
        />
      </div>
      <div className="flex justify-between items-center text-sm text-gray-400 my-4">
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            className="rounded cursor-pointer"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
            className="rounded cursor-pointer"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
