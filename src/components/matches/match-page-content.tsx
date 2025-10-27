"use client";
import MatchStats from "@/components/matches/match-stats";
import TeamTable from "@/components/matches/team-table";
import TeamTitle from "@/components/matches/team-title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllHeroesAssets } from "@/lib/data/heroes";
import { getMatchMetadata } from "@/lib/data/matches";
import { getPlayersBySteamId } from "@/lib/data/players";
import { cn, formatDuration, formatNumber, groupPlayersByTeam } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export default function MatchPageContent({ matchId }: { matchId: number }) {
  const { data: matchData } = useQuery({
    queryKey: ["match", matchId],
    queryFn: () => getMatchMetadata(matchId),
  });

  const playerIds =
    matchData?.match_info.players
      .map((p) => String(p.account_id))
      .filter(Boolean) ?? [];

  const { data: playersData } = useQuery({
    queryKey: ["players", playerIds],
    queryFn: () => getPlayersBySteamId(playerIds),
    enabled: playerIds.length > 0, // prevents running before matchData is ready
  });

  const { data: heroes } = useQuery({
    queryKey: ["hero-assets"],
    queryFn: getAllHeroesAssets,
    staleTime: 1000 * 60 * 60 * 24,
  });

  if (!matchData) return null;

  const { team0, team1 } = groupPlayersByTeam(matchData);

  const playerMap = new Map(playersData?.map((p) => [p.account_id, p]) ?? []);
  const heroMap = new Map(heroes?.map((h) => [h.id, h]) ?? []);
  
  return (
    <div>
      <div className="bg-gradient-to-b from-blk-800 to-blk-900 w-full py-8 rounded-b-[30px] px-4 xl:px-0 shadow-2xl shadow-prim-500/10">
        {matchData ? (
          <div className="flex justify-between max-w-7xl mx-auto">
            <TeamTitle
              name="The Amber Hand"
              teamIndex={0}
              winningTeam={matchData.match_info.winning_team as 0 | 1}
              rank={matchData.match_info.average_badge_team0}
            />
            <div className="flex justify-between items-center shrink-0 gap-4 bg-blk-700 px-2 py-1 rounded border border-blk-500">
              <div className={cn("text-md md:text-lg xl:text-3xl font-bold bg-blk-800 px-4 py-2.5 rounded text-gray-200 border border-blk-500")}>
                {formatNumber(team0.netWorth)}
              </div>
              <div className="flex flex-col items-center justify-between">
                <div className="text-xs">Game Time</div>
                <div className="font-semibold text-sm md:text-base xl:text-lg leading-5">
                  {formatDuration(matchData.match_info.duration_s)}
                </div>
              </div>
              <div className={cn("text-md md:text-lg xl:text-3xl font-bold bg-blk-800 px-4 py-2.5 rounded text-gray-200 border border-blk-500")}>
                {formatNumber(team1.netWorth)}
              </div>
            </div>
            <TeamTitle
              name="The Sapphire Flame"
              teamIndex={1}
              winningTeam={matchData.match_info.winning_team as 0 | 1}
              rank={matchData.match_info.average_badge_team1}
              side="right"
            />
          </div>
        ) : null}
      </div>
      <div className="max-w-7xl w-full mx-auto px-4 py-4 xl:px-0">
        {matchData ? (
          (() => {
            return (
              <Tabs
                className="bg-blk-800 gap-0 border border-blk-500 rounded"
                defaultValue="overview"
              >
                <div className="border-b border-blk-500 px-2">
                  <div className="flex items-center justify-between">
                    <TabsList className="flex gap-1 p-0">
                      <TabsTrigger
                        value="overview"
                        className="relative cursor-pointer py-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-[3px] after:bg-brand after:rounded-t-lg after:opacity-0 data-[state=active]:after:opacity-100 transition-all"
                      >
                        Overview
                      </TabsTrigger>
                      <TabsTrigger
                        value="stats"
                        className="relative cursor-pointer py-3 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-[3px] after:bg-brand after:rounded-t-lg after:opacity-0 data-[state=active]:after:opacity-100 transition-all"
                      >
                        Stats
                      </TabsTrigger>
                    </TabsList>
                    <div className="text-sm text-muted-foreground">
                      Match ID: {matchId}
                    </div>
                  </div>
                </div>
                <TabsContent
                  value="overview"
                  className="flex flex-col gap-2 p-2"
                >
                  <TeamTable team={team0} players={playerMap} heroes={heroMap} />
                  <TeamTable team={team1} players={playerMap} heroes={heroMap} />
                </TabsContent>
                <TabsContent value="stats" className="p-2">
                  <MatchStats data={matchData.match_info} heroes={heroMap} players={playerMap} />
                </TabsContent>
              </Tabs>
            );
          })()
        ) : (
          <div>Missing match metadata</div>
        )}
      </div>
    </div>
  );
}
