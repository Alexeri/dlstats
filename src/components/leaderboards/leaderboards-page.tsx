"use client";

import FilterData from "@/components/filter-data";
import LeaderboardTable from "@/components/leaderboards/leaderboards-table";
import { Button } from "@/components/ui/button";
import { getLeaderboard } from "@/lib/data/leaderboards";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const PAGE_SIZE = 50;

export default function LeaderboardsContent({ region }: { region: string }) {
  const [page, setPage] = useState(0);
  const {
    data: leaderboard,
    isLoading: leaderboardLoading,
    error: leaderboardError,
  } = useQuery({
    queryKey: ["leaderboard", region ?? "Europe"],
    queryFn: () => getLeaderboard(region ?? "Europe"),
  });

  if (leaderboardLoading) return <p>Loading leaderboard...</p>;
  if (leaderboardError)
    return (
      <p>Error loading leaderboard: {(leaderboardError as Error).message}</p>
    );
  if (!leaderboard?.length) return <p>No leaderboard data available.</p>;

  const totalPages = Math.ceil(leaderboard.length / PAGE_SIZE);
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageData = leaderboard.slice(start, end);

  return (
    <div>
      <div className="text-3xl font-bold my-8">Leaderboards</div>
      <div className="flex flex-col gap-4">
        <FilterData hideFilters={{ rank: true, timeframe: true }} />
        <LeaderboardTable data={pageData} />
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
