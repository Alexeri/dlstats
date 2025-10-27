import BorderedImage from "@/components/bordered-image";
import { HeroAsset, MatchMetadataPlayer } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

interface MatchHistoryTeamProps {
  players: MatchMetadataPlayer[];
  heroMap: Record<number, HeroAsset>; // hero.id → hero data
}

export default function MatchHistoryTeam({
  players,
  heroMap,
}: MatchHistoryTeamProps) {
  const params = useParams();
  const currentPlayerId = params?.id;

  return (
    <div>
      {players.map((player) => {
        const hero = heroMap[player.hero_id];

        const isCurrentPlayer = currentPlayerId === String(player.account_id);

        const hasImage = hero?.images?.icon_image_small;

        return (
          <div className="flex items-center gap-0.5" key={player.account_id}>
            {hasImage ? (
              <BorderedImage
              src={hero.images.icon_image_small}
              alt={hero.name}
              className="size-4"
            />
            ):(<div className="size-4 bg-blk-200"></div>)}
            
            <span
              className={cn(
                "text-xs text-gray-400 min-w-[7ch] max-w-[7ch] truncate",
                isCurrentPlayer && "text-white"
              )}
            >
              {hero?.name || 'Unknown Hero'}
            </span>
          </div>
        );
      })}
    </div>
  );
}
