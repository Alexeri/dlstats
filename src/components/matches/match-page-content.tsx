"use client";
import TeamTable from "@/components/matches/team-table";
import TeamTitle from "@/components/matches/team-title";
import { getMatchMetadata } from "@/lib/data/matches";
import { formatDuration, formatNumber, groupPlayersByTeam } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";


export default function MatchPageContent({ matchId }: { matchId: number }) {
  const { data } = useQuery({
    queryKey: ["match", matchId],
    queryFn: () => getMatchMetadata(matchId),
  });

  if (!data) return null;

  const {team0, team1} = groupPlayersByTeam(data);

  return (
    <div>
      <div className="bg-gradient-to-b from-blk-800 to-blk-900 w-full py-8 rounded-b-[30px] px-4 xl:px-0 shadow-2xl shadow-prim-500/10">
        {data ? (
          <div className="flex justify-between max-w-7xl mx-auto">
            <TeamTitle
              name="The Amber Hand"
              teamIndex={0}
              winningTeam={data.match_info.winning_team as 0 | 1}
            />
            <div className="flex justify-between items-center  shrink-0 gap-4 bg-blk-600 p-2 rounded">
              <div className="text-3xl font-bold bg-blk-700 px-4 py-2.5 rounded text-gray-200">
                {formatNumber(team0.netWorth)}
              </div>
              <div className="flex flex-col items-center justify-between">
                <div>vs</div>
                <div className="font-semibold text-xs">
                  {formatDuration(data.match_info.duration_s)}
                </div>
              </div>
              <div className="text-3xl font-bold bg-blk-700 px-4 py-2.5 rounded text-gray-200">
                {formatNumber(team1.netWorth)}
              </div>
            </div>
            <TeamTitle
              name="The Sapphire Flame"
              teamIndex={1}
              winningTeam={data.match_info.winning_team as 0 | 1}
              side="right"
            />
          </div>
        ) : null}
      </div>
      <div className="min-h-[1000px] max-w-7xl w-full mx-auto px-4 py-4 xl:px-0">
        {}
        {matchId}
        {data ? (
          (() => {
            /* const team0 = data.match_info.players.filter(
              (p) => Number(p.team) === 0
            );
            const team1 = data.match_info.players.filter(
              (p) => Number(p.team) === 1
            ); */

            /* const topPlayers = getTopPlayers(metadata);
            const time = timeAgo(metadata.match_info.start_time); */
            return (
              <>
                {/* <div className="flex justify-between gap-1 ">
                  <TeamTable team={team0} />
                  <div className="w-8 shrink-0">
                    <div className="h-full flex items-center justify-center text-gray-500">
                      vs
                    </div>
                  </div>
                  <TeamTable team={team1} />
                </div> */}
                <div className="p-2 bg-blk-800 border border-blk-500 rounded flex flex-col gap-2">
                  <TeamTable team={team0} />
                  <TeamTable team={team1} />
                </div>
              </>
            );
          })()
        ) : (
          <div>Missing match metadata</div>
        )}
      </div>
    </div>
  );
}
