"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDialog } from "../providers/dialog-provider";
import { useQuery } from "@tanstack/react-query";
import { cn, formatHeroName } from "@/lib/utils";
import { getAllHeroesAssets } from "@/lib/data/heroes";
import { Search, X } from "lucide-react";
import Link from "next/link";
import BorderedImage from "@/components/bordered-image";

export default function SearchDialog() {
  const { isOpen, close } = useDialog();
  const [query, setQuery] = React.useState("");

  const { data: heroes } = useQuery({
    queryKey: ["hero-assets"],
    queryFn: getAllHeroesAssets,
    staleTime: 1000 * 60 * 60 * 24,
  });

  const filteredHeroes = React.useMemo(() => {
    if (!heroes) return [];
    const filtered = query.trim()
      ? heroes.filter((h) =>
          h.name.toLowerCase().includes(query.toLowerCase())
        )
      : [];
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [heroes, query]);

  const showEmptyPrompt = !query.trim();

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="[&>button]:hidden p-0 border-transparent top-2 translate-y-[0%] min-w-2xl rounded bg-blk-700">
        <DialogTitle className="sr-only"></DialogTitle>
        <div className="flex flex-col">
          <div className="w-full relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search size="18" className="text-muted-foreground" />
            </div>
            <Input
              placeholder="Search Player or Hero"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="dark:bg-blk-800 border-blk-500 pl-10 placeholder:text-gray-300 rounded shadow-xl shadow-brand/10"
              autoComplete="off"
              spellCheck={false}
              autoFocus
            />
            {query && (
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setQuery("")}
              >
                <X size="18" className="text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="max-h-[400px] overflow-y-auto">

            {/* no input yet */}
            {showEmptyPrompt && (
              <div className="text-center text-sm text-muted-foreground py-4">
                Enter a Hero Name or your SteamID3 URL
              </div>
            )}

            {/* input, but no results */}
            {!showEmptyPrompt && filteredHeroes.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-4">
                No heroes found
              </div>
            )}

            {/* show results if found */}
            {filteredHeroes.length > 0 && (
              <div className="p-2">
                <span className="font-bold uppercase text-gray-300 text-xs block mb-1">
                  Heroes
                </span>
                <div className="flex flex-col">
                  {filteredHeroes.map((hero) => (
                    <Link
                      href={`/heroes/${formatHeroName(hero.name ?? "")}`}
                      key={hero.id}
                      onClick={() => {
                        close();
                        setQuery("");
                      }}
                      className={cn(
                        "flex items-center gap-2 hover:bg-blk-600 rounded cursor-pointer transition-colors p-1"
                      )}
                    >
                      <BorderedImage
                        src={hero.images.icon_hero_card}
                        alt={hero.name}
                        className="size-7"
                      />
                      <div className="font-medium text-sm">{hero.name}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
