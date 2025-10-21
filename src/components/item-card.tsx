import BorderedImage from "@/components/bordered-image";
import { HoverCard } from "@/components/ui/hover-card";
import { Item, ItemProperty } from "@/lib/types";
import { cn } from "@/lib/utils";
import { HoverCardContent, HoverCardTrigger } from "@radix-ui/react-hover-card";
import DOMPurify from "isomorphic-dompurify";

interface ItemCardProps {
  item: Item;
  trigger?: React.ReactNode;
}

export function getTooltipPropertyKeysByType(
  item: Item,
  sectionType: string
): string[] {
  if (!item.tooltip_sections?.length) return [];

  const keys = item.tooltip_sections
    .filter((section) => section.section_type === sectionType)
    .flatMap((section) =>
      (section.section_attributes ?? []).flatMap((attr) => [
        ...(attr.properties ?? []),
        ...(attr.elevated_properties ?? []),
        ...(attr.important_properties ?? []),
      ])
    );

  return [...new Set(keys)];
}

function getPassiveSections(item: Item) {
  return (
    item.tooltip_sections
      ?.filter((section) => section.section_type === "passive")
      .flatMap((section) => section.section_attributes ?? [])
      .slice() ?? []
  );
}

export default function ItemCard({ item, trigger }: ItemCardProps) {
  const innateKeys = getTooltipPropertyKeysByType(item, "innate");

  const getSectionProperties = (keys: string[]) =>
    Object.entries(item.properties).filter(([key, prop]) => {
      if (!keys.includes(key)) return false;

      const raw = String(prop.value ?? "").trim();
      if (raw === "" || raw === "0" || raw === "0.0" || raw === "-")
        return false;

      const numeric = parseFloat(raw.replace(/[^\d.-]/g, ""));
      return !isNaN(numeric) ? numeric !== 0 : true;
    }) as [string, ItemProperty][];

  const itemStats = getSectionProperties(innateKeys);

  const passiveSections = getPassiveSections(item);

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild>
        {trigger ??
          (item.shop_image_small_webp ? (
            <div className="relative z-10">
              <BorderedImage
                src={item.shop_image_small_webp}
                alt={item.name}
                className="size-8"
                imageClassName="rounded"
              />
            </div>
          ) : (
            <div className="size-8 bg-blk-500 rounded"></div>
          ))}
      </HoverCardTrigger>
      <HoverCardContent side="top" className="z-[100]">
        <div className="w-[320px] drop-shadow-xl ">
          <div
            className={cn(
              "flex flex-col px-4 py-3 rounded-t",
              item.item_slot_type === "weapon" && "bg-weapon",
              item.item_slot_type === "vitality" && "bg-vitality",
              item.item_slot_type === "spirit" && "bg-spirit"
            )}
          >
            <div className="flex justify-between text-md font-bold [text-shadow:1px_1px_2px_rgba(0,0,0,0.4)]">
              <span>{item.name}</span>
              <span>{item.id}</span>
            </div>
            <span className="text-sm font-semibold [text-shadow:1px_1px_2px_rgba(0,0,0,0.4)]">
              {item.cost}
            </span>
          </div>

          {itemStats.length > 0 && (
            <div className="px-4 py-3 bg-blk-600">
              <div className="flex flex-col">
                {itemStats.map(([key, prop]) => (
                  <div key={key} className={cn("flex items-center text-xs")}>
                    <div className="flex gap-1">
                      <span className=" font-semibold text-white">
                        {prop.prefix === "{s:sign}"
                          ? parseFloat(String(prop.value)) > 0
                            ? "+"
                            : ""
                          : prop.prefix ?? ""}
                        {String(prop.value).replace(/[^0-9.+-]/g, "")}
                        {prop.postfix ?? ""}
                      </span>
                      <span className=" text-gray-400">
                        {String(prop.label || key)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {passiveSections.length > 0 && (
            <div className="flex flex-col">
              {passiveSections.map((section, i) => {
                // find AbilityCooldown if present in this section
                const cooldownKey = (section.properties ?? []).find(
                  (p) => p === "AbilityCooldown"
                );
                const cooldownProp: ItemProperty | undefined = cooldownKey
                  ? item.properties[cooldownKey]
                  : undefined;

                // collect all other properties (excluding AbilityCooldown)
                const regularTooltips = (section.properties ?? []).filter(
                  (key) => key !== "AbilityCooldown"
                );
                const elevatedTooltips = section.elevated_properties ?? [];
                const importantTooltips = section.important_properties ?? [];

                return (
                  <div key={i} className="flex flex-col bg-blk-600">
                    {/* section title bar (with cooldown if available) */}
                    <div className="flex items-center justify-between bg-blk-300  font-bold text-xs">
                      <span className="px-4 py-1">Passive</span>
                      {(() => {
                        if (!cooldownProp) return null;
                        const numericValue = parseFloat(
                          String(cooldownProp.value)
                        );
                        if (isNaN(numericValue) || numericValue <= 0)
                          return null;

                        return (
                          <span className="text-gray-200 text-sm font-bold bg-blk-900 px-4 py-1">
                            {cooldownProp.prefix === "{s:sign}"
                              ? "+"
                              : cooldownProp.prefix ?? ""}
                            {String(cooldownProp.value).replace(
                              /[^0-9.+-]/g,
                              ""
                            )}
                            {cooldownProp.postfix ?? ""}
                          </span>
                        );
                      })()}
                    </div>
                    <div className="px-4 py-3 flex flex-col gap-2">
                      {/* description */}
                      {section.loc_string && (
                        <div
                          className="text-xs ability-description"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(section.loc_string),
                          }}
                        />
                      )}
                      <div className="flex flex-col gap-1">
                        {importantTooltips.length > 0 && (
                          <div
                            className={cn(
                              `grid grid-cols-${importantTooltips.length} gap-1`
                            )}
                          >
                            {importantTooltips.map((propKey) => {
                              const prop = item.properties[propKey];
                              if (!prop) return null;
                              return (
                                <div
                                  key={propKey}
                                  className="flex flex-col items-center justify-center text-center text-xs px-2 py-1 bg-blk-400 rounded leading-4"
                                >
                                  <span className="font-bold ">
                                    {prop.prefix === "{s:sign}"
                                      ? parseFloat(String(prop.value)) > 0
                                        ? "+"
                                        : ""
                                      : prop.prefix ?? ""}
                                    {String(prop.value).replace(
                                      /[^0-9.+-]/g,
                                      ""
                                    )}
                                    {prop.postfix ?? ""}
                                  </span>
                                  <span className="text-gray-400 text-xs">
                                    {prop.label || propKey}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {regularTooltips.length > 0 && (
                          <div className="grid grid-cols-2 bg-blk-400 px-2 py-1 rounded">
                            {regularTooltips.map((propKey) => {
                              const prop = item.properties[propKey];
                              if (!prop) return null;
                              return (
                                <div
                                  key={propKey}
                                  className="flex items-baseline gap-1 text-xs"
                                >
                                  <span className="font-semibold">
                                    {prop.prefix === "{s:sign}"
                                      ? parseFloat(String(prop.value)) > 0
                                        ? "+"
                                        : ""
                                      : prop.prefix ?? ""}
                                    {String(prop.value).replace(
                                      /[^0-9.+-]/g,
                                      ""
                                    )}
                                    {prop.postfix ?? ""}
                                  </span>
                                  <span className="text-gray-400 text-xs">
                                    {prop.label || propKey}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {elevatedTooltips.length > 0 && (
                          <div className="grid grid-cols-2 bg-blk-400 px-2 py-1 rounded">
                            {elevatedTooltips.map((propKey) => {
                              const prop = item.properties[propKey];
                              if (!prop) return null;
                              return (
                                <div
                                  key={propKey}
                                  className="flex gap-1 text-xs items-baseline"
                                >
                                  <span className="font-semibold italic">
                                    {prop.prefix === "{s:sign}"
                                      ? parseFloat(String(prop.value)) > 0
                                        ? "+"
                                        : ""
                                      : prop.prefix ?? ""}
                                    {String(prop.value).replace(
                                      /[^0-9.+-]/g,
                                      ""
                                    )}
                                    {prop.postfix ?? ""}
                                  </span>
                                  <span className="text-gray-400 text-xs ">
                                    {prop.label || propKey}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
