import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Item } from "@/lib/types";
import { parseNumericValue } from "@/lib/utils";
import DOMPurify from "isomorphic-dompurify";
import BorderedImage from "@/components/bordered-image";

interface AbilitySectionProps {
  signatureAbilities: Item[];
  abilitiesLoading: boolean;
  abilitiesError?: Error | null;
}

export default function AbilitySection({
  signatureAbilities,
  abilitiesLoading,
  abilitiesError,
}: AbilitySectionProps) {
  if (abilitiesLoading) return <p>Loading...</p>;
  if (abilitiesError)
    return <p>Error loading abilities: {abilitiesError.message}</p>;
  if (!signatureAbilities || signatureAbilities.length === 0) return null;

  return (
    <div className="flex gap-2">
      {signatureAbilities.map((ability, i) => (
        <HoverCard key={i} openDelay={0} closeDelay={0}>
          <HoverCardTrigger>
            <BorderedImage
              src={ability.image_webp}
              alt={ability.name}
              className="w-9 h-9"
              imageClassName="filter brightness-0 invert opacity-80 p-1"
              letter={i + 1}
              letterClassName="text-xs"
            />
          </HoverCardTrigger>
          <HoverCardContent className="flex flex-col w-[28rem] p-4 bg-blk-800/80 backdrop-blur-sm">
            <div className="font-semibold">
              <span>{ability.name} </span>
              <span>({i + 1})</span>
            </div>
            <div className="font-semibold">
              {/* Cooldown */}
              {ability.properties.Damage &&
                parseNumericValue(ability.properties.Damage.value) > 0 && (
                  <div className="flex text-sm gap-1 ">
                    <span>Damage:</span>
                    <span className="text-brand">{String(ability.properties.Damage.value)}</span>
                  </div>
                )}

              {/* Cooldown */}
              {ability.properties.AbilityCooldown &&
                parseNumericValue(ability.properties.AbilityCooldown.value) >
                  0 && (
                  <div className="flex text-sm gap-1">
                    <span>Cooldown:</span>
                    <span className="text-brand">
                      {String(ability.properties.AbilityCooldown.value)}
                      {String(ability.properties.AbilityCooldown.postfix)}
                    </span>
                  </div>
                )}

              {/* Duration */}
              {ability.properties.AbilityDuration &&
                parseNumericValue(ability.properties.AbilityDuration.value) >
                  0 && (
                  <div className="flex text-sm gap-1">
                    <span>Duration:</span>
                    <span className="text-brand">
                      {String(ability.properties.AbilityDuration.value)}
                      {String(ability.properties.AbilityDuration.postfix)}
                    </span>
                  </div>
                )}

              {/* Cast Range */}
              {ability.properties.AbilityCastRange &&
                parseNumericValue(ability.properties.AbilityCastRange.value) >
                  0 && (
                  <div className="flex text-sm gap-1">
                    <span>Cast Range:</span>
                    <span className="text-brand">{String(ability.properties.AbilityCastRange.value)}</span>
                  </div>
                )}
            </div>

            {ability.description.desc && (
              <div className="flex flex-col gap-2 mt-4">
                <div
                  className="text-sm ability-description"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(ability.description.desc),
                  }}
                ></div>
                {ability.description.t2_desc && (
                  <span
                    className="text-sm"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(ability.description.t2_desc),
                    }}
                  ></span>
                )}
              </div>
            )}
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
}
