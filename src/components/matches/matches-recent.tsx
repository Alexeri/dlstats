"use client";
import SectionHeader from "@/components/section-header";
import { getRecentMatches } from "@/lib/data/matches";
import { useQuery } from "@tanstack/react-query";
import { Swords } from "lucide-react";
import Link from "next/link";

export default function MatchesRecent() {
  const {
    data: matches,
    isLoading: matchesLoading,
    error: matchesError,
  } = useQuery({
    queryKey: ["matches", "recent"],
    queryFn: () => getRecentMatches(),
  });

  if (matchesLoading) return <p>Loading leaderboard...</p>;
  if (matchesError)
    return <p>Error loading leaderboard: {(matchesError as Error).message}</p>;
  if (!matches?.length) return <p>No leaderboard data available.</p>;
  return (
    <>
      <SectionHeader
        title="Matches"
        subtitle="Browse recent matches and dive into detailed performance stats."
        icon={<Swords size={50} />}
      />
      <div className="max-w-7xl mx-auto px-4 xl:px-0 mt-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Recent Matches</h2>
          <div className="grid grid-cols-2 gap-4">
            {matches.map((match) => (
              <Link
                href={`/matches/${match.match_id}`}
                key={match.match_id}
                className="p-4 bg-blk-800 rounded border border-blk-500 hover:bg-blk-700 transition-all"
              >
                {match.match_id}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
