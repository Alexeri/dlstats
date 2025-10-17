import BorderedImage from "@/components/bordered-image";
import { MatchMetadataPlayer } from "@/lib/types";
import { useParams } from "next/navigation";

interface MatchHistoryItemsProps {
  players: MatchMetadataPlayer[];
  allItemsMap: Record<number, { name: string; shop_image_small_webp?: string }>;
  isLoading?: boolean;
  isError?: boolean;
}

export default function MatchHistoryItems({
  players,
  allItemsMap,
  isLoading,
  isError,
}: MatchHistoryItemsProps) {
  const params = useParams();
  const currentPlayerId = Number(params?.id); 
  const player = players.find((p) => p.account_id === currentPlayerId);
  if (!player) return null;

  // filter out sold items
  const finalItems = player.items
    .filter((i) => !i.sold_time_s)
    .map((i) => allItemsMap[i.item_id])
    .filter(Boolean);

  // 12 item slots
  const itemSlots = Array.from({ length: 12 }).map(
    (_, idx) => finalItems[idx] || null
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-6 gap-1 animate-pulse">
        {Array.from({ length: 12 }).map((_, idx) => (
          <div key={idx} className="size-8 bg-blk-500 rounded" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="grid grid-cols-6 gap-1">
        {Array.from({ length: 12 }).map((_, idx) => (
          <div
            key={idx}
            className="size-8 bg-blk-700 rounded flex items-center justify-center text-xs text-gray-500"
          >
            ?
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-6 gap-1">
        {itemSlots.map((item, idx) =>
          item ? (
            <BorderedImage
              key={idx}
              src={item.shop_image_small_webp || ""}
              alt={item.name}
              className="size-8"
              imageClassName="rounded"
            />
          ) : (
            <div key={idx} className="size-8 bg-blk-500 rounded" />
          )
        )}
      </div>
    </div>
  );
}
