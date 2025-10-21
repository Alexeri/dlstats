import BorderedImage from "@/components/bordered-image";
import ItemCard from "@/components/item-card";
import { Item, MatchMetadataPlayer } from "@/lib/types";

interface PlayerItemsProps {
  items: MatchMetadataPlayer["items"];
  allItemsMap: Record<number, Item>;
}

export default function PlayerItems({ items, allItemsMap }: PlayerItemsProps) {
  // filter out sold items and map to item data
  const finalItems = items
    .filter((i) => !i.sold_time_s)
    .map((i) => allItemsMap[i.item_id])
    .filter(Boolean);

  // always 12 slots
  const itemSlots = Array.from({ length: 12 }).map(
    (_, idx) => finalItems[idx] || null
  );

  return (
    <div className="grid grid-cols-6 gap-1">
      {itemSlots.map((item, idx) =>
        item && item.shop_image_small_webp ? (
          <ItemCard
            item={item}
            key={idx}
            trigger={
              <div className="relative z-10">
                <BorderedImage
                  src={item.shop_image_small_webp}
                  alt={item.name}
                  className="size-6"
                  imageClassName="rounded"
                />
              </div>
            }
          />
        ) : (
          <div key={idx} className={`bg-blk-500 rounded size-6`} />
        )
      )}
    </div>
  );
}
