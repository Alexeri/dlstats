import { cn } from "@/lib/utils";
import { CircleX, Trophy } from "lucide-react";

interface TeamTitleProps {
  name: string;
  teamIndex: 0 | 1;
  winningTeam: 0 | 1;
  side?: "left" | "right";
  avatar?: React.ReactNode;
}
export default function TeamTitle({
  name,
  teamIndex,
  winningTeam,
  side,
  avatar,
}: TeamTitleProps) {
  const isWinner = teamIndex === winningTeam;
  const alignment = side === "right" ? "text-end" : "text-start";
  const flexDirection = side === "right" ? "flex-row-reverse" : "flex-row";
  const justify = side === "right" ? "justify-end" : "justify-start";

  return (
    <div className={`flex w-full gap-4 ${flexDirection}`}>
      {avatar && (
        <div className="p-2 bg-blk-700 border border-blk-500 rounded flex items-center">
          {avatar}
        </div>
      )}
      <div
        className={`flex flex-col w-full justify-between p-0.5 ${alignment}`}
      >
        <div className="text-4xl font-bold">{name}</div>
        <div className={`flex ${justify}`}>
          <div
            className={cn(
              "px-3 rounded text-black font-medium bg-blk-600 flex items-center gap-1",
              {
                "bg-green-400/15 border-green-400/30 border text-win": isWinner,
                "bg-red-400/15 border-red-400/30 border text-loss": !isWinner,
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
