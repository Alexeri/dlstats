import BorderedImage from "@/components/bordered-image";
import { cn, getSubrankImage } from "@/lib/utils";
import { CircleX, Trophy } from "lucide-react";

interface TeamTitleProps {
  name: string;
  teamIndex: 0 | 1;
  winningTeam: 0 | 1;
  rank: number;
  side?: "left" | "right";
}
export default function TeamTitle({
  name,
  teamIndex,
  winningTeam,
  rank,
  side,
}: TeamTitleProps) {
  const isWinner = teamIndex === winningTeam;
  const alignment = side === "right" ? "text-end" : "text-start";
  const flexDirection = side === "right" ? "flex-row-reverse" : "flex-row";
  const justify = side === "right" ? "justify-end" : "justify-start";

  return (
    <div className={`flex w-full gap-4 ${flexDirection}`}>
      <BorderedImage
        src={getSubrankImage(rank)}
        alt={name + " rank"}
        className="h-full aspect-square"
        imageClassName="object-contain p-2"
      />

      <div
        className={`flex flex-col w-full justify-between p-0.5 ${alignment}`}
      >
        <div
          className={cn(
            "text-4xl font-bold",
            teamIndex === 0 ? "text-amberhand" : "text-sapphireflame"
          )}
        >
          {name}
        </div>
        <div className={`flex ${justify}`}>
          <div
            className={cn(
              "px-3 rounded text-black font-medium bg-blk-600 flex items-center gap-1",
              {
                "bg-green-400/15 border-green-400/30 border text-green-400": isWinner,
                "bg-red-400/15 border-red-400/30 border text-red-400": !isWinner,
              }
            )}
          >
            {isWinner ? <Trophy size={14} /> : <CircleX size={14} />}
            <span>{isWinner ? "Victory" : "Defeat"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
