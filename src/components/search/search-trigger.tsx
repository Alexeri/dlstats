"use client";

import { cn } from "@/lib/utils";
import { useDialog } from "../providers/dialog-provider";
import { Search } from "lucide-react";

export function SearchTrigger({ className, large  }: { className?: string, large?: boolean }) {
  const { open } = useDialog();

  return (
    <button
      onClick={open}
      className={cn(
        "flex justify-between bg-blk-700 border border-blk-500 px-3 py-1.5 rounded text-sm text-gray-300 hover:bg-blk-600 transition w-full cursor-pointer",
        className,
        large && "py-3 text-sm"
      )}
    >

      <div className="flex gap-2 items-center">
        <Search className="w-4 h-4" />
        <span className="">Search Hero</span>
      </div>
      <span className="bg-blk-700 border border-blk-500 px-2 rounded text-xs flex items-center">Ctrl K</span>
    </button>
  );
}
