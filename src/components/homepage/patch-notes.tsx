"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { ArrowRight, NotebookText } from "lucide-react";
import { patchQueries } from "@/lib/queries/patches";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function PatchNotes() {
  const { data: patches, isLoading, error } = useQuery(patchQueries.history());

  if (isLoading)
    return (
      <div className="bg-blk-800 rounded border border-blk-500 p-4 h-[325px]">
        <h3 className="text-lg font-semibold mb-2">Patch Notes</h3>
        <p className="text-gray-400 text-sm">Loading latest updates...</p>
      </div>
    );

  if (error)
    return (
      <div className="bg-blk-800 rounded border border-blk-500 p-4 h-[325px]">
        <h3 className="text-lg font-semibold mb-2">Patch Notes</h3>
        <p className="text-red-400 text-sm">
          Failed to load patch notes. Please try again later.
        </p>
      </div>
    );

  const latest = patches?.slice(0, 2) ?? [];

  return (
    <div className="bg-blk-800 rounded border border-blk-500 p-4 h-[325px] flex flex-col">
      <div className="flex items-center gap-1">
        <NotebookText size={18} />
        <h3 className="text-lg font-semibold">Patch Notes</h3>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        {latest.map((patch) => {
          const cleanHTML = DOMPurify.sanitize(patch.content_encoded);
          const preview = cleanHTML.replace(/<[^>]+>/g, "").slice(0, 160);
          return (
            <Link
              key={patch.link}
              href={patch.link}
              target="_blank"
              rel="noopener noreferrer"
              className="pb-2 bg-blk-700 p-2 rounded hover:bg-blk-600 transition-all"
            >
              <div className="text-primary font-semibold">{patch.title}</div>
              <div className="text-gray-400 text-xs">
                {formatDate(patch.pub_date)}
              </div>
              <div
                className="text-xs text-gray-300 mt-1 line-clamp-2"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(preview + "..."),
                }}
              />
            </Link>
          );
        })}
      </div>

      <div className="mt-auto">
        <Link
          href="https://forums.playdeadlock.com/forums/changelog.10/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:bg-blk-700 px-2 py-1 rounded inline-flex items-center gap-1 transition-all"
        >
          View all patch notes <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
