"use client";
import MatchLink from "@/components/matches/match-link";
import SectionHeader from "@/components/section-header";
import { getMatchesMetadata, getRecentMatches } from "@/lib/data/matches";
import { useQuery } from "@tanstack/react-query";
import { Swords } from "lucide-react";

export default function MatchesRecent() {
  const {
    data: matches,
    isLoading: matchesLoading,
    error: matchesError,
  } = useQuery({
    queryKey: ["matches", "recent"],
    queryFn: () => getRecentMatches(),
  });

  const limitedMatches = matches?.slice(0, 8) ?? [];
  const matchIds = limitedMatches.map((m) => m.match_id);

  const {
    data: metadata,
    isLoading: metadataLoading,
    error: metadataError,
  } = useQuery({
    queryKey: ["matches", "metadata", matchIds],
    queryFn: () => getMatchesMetadata(matchIds),
    enabled: matchIds.length > 0, // only run when matches are loaded
  });

  const combinedMatches =
    matches?.map((m) => ({
      ...m,
      metadata: metadata?.find((meta) => meta.match_id === m.match_id),
    })) ?? [];

  return (
    <>
      <SectionHeader
        title="Matches"
        subtitle="Browse recent matches and dive into detailed performance stats."
        icon={<Swords size={50} />}
      />

      <div className="max-w-7xl mx-auto px-4 xl:px-0 mt-4 min-h-[500px]">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Recent Matches</h2>

          {/* loading & error states */}
          {matchesLoading && (
            <p className="text-gray-400 text-sm italic">
              Loading recent matches...
            </p>
          )}
          {matchesError && (
            <p className="text-red-400 text-sm">
              Error loading recent matches: {(matchesError as Error).message}
            </p>
          )}
          {metadataLoading && !matchesLoading && (
            <p className="text-gray-400 text-sm italic">
              Fetching match metadata...
            </p>
          )}
          {metadataError && (
            <p className="text-red-400 text-sm">
              Error loading match metadata: {(metadataError as Error).message}
            </p>
          )}

          {/* no data */}
          {!matchesLoading && !matchesError && matches?.length === 0 && (
            <p className="text-gray-500 italic">
              No recent matches data available.
            </p>
          )}

          {combinedMatches.length > 0 && (
            <div className="grid lg:grid-cols-2 gap-4">
              {combinedMatches.map((match) => (
                <MatchLink key={match.match_id} match={match} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
