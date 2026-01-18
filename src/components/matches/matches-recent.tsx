"use client";
import MatchLink from "@/components/matches/match-link";
import SectionHeader from "@/components/section-header";
import { matchQueries } from "@/lib/queries/matches";
import { useQuery } from "@tanstack/react-query";
import { Swords } from "lucide-react";

export default function MatchesRecent() {
  const {
    data: matches,
    isLoading: matchesLoading,
    error: matchesError,
  } = useQuery(matchQueries.recent());

  const limitedMatches = matches?.slice(0, 8) ?? [];
  const matchIds = limitedMatches.map((m) => m.match_id);

  const {
    data: metadata,
    isLoading: metadataLoading,
    error: metadataError,
  } = useQuery({
    ...matchQueries.metadataArray(matchIds),
    enabled: matchIds.length > 0,
  });

  const combinedMatches =
    limitedMatches?.map((m) => ({
      ...m,
      metadata: metadata?.find((meta) => meta.match_id === m.match_id),
    })) ?? [];

  const matchesReady = !!matches && !matchesLoading && !matchesError;
  const metadataReady =
    matchesReady &&
    !metadataLoading &&
    !metadataError &&
    metadata?.length === limitedMatches.length;

  const isReady = matchesReady && metadataReady;

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

          {/* hard error states */}
          {matchesError && (
            <p className="text-red-400 text-sm">
              Error loading recent matches: {(matchesError as Error).message}
            </p>
          )}

          {metadataError && (
            <p className="text-red-400 text-sm">
              Error loading match metadata: {(metadataError as Error).message}
            </p>
          )}

          {/* content */}
          <div className="grid lg:grid-cols-2 gap-4">
            {!isReady &&
              Array.from({ length: 8 }).map((_, i) => (
                <MatchSkeleton key={i} />
              ))}

            {isReady &&
              combinedMatches.map((match) => (
                <MatchLink key={match.match_id} match={match} />
              ))}
          </div>

          {/* empty state */}
          {isReady && combinedMatches.length === 0 && (
            <p className="text-gray-500 italic">
              No recent matches data available.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

function MatchSkeleton() {
  return (
    <div className="p-4 rounded border border-blk-500 bg-blk-800 min-h-[182px] animate-pulse"></div>
  );
}
