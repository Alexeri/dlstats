import PatchNotes from "@/components/homepage/patch-notes";
import { SearchTrigger } from "@/components/search/search-trigger";
import TierlistSnippet from "@/components/homepage/tierlist-snippet";
import Image from "next/image";
import LeaderboardsSnippet from "@/components/homepage/leaderboards-snippet";

export default function Home() {
  return (
    <div className="overflow-hidden relative">
      
      <div className="max-w-7xl mx-auto px-4 xl:px-0 py-32  min-h-[calc(100vh-50px)] relative  ">
        <div
        style={{
          transform: "translate(-50%, -60%)",
          overflow: "hidden",
        }}
        className="absolute left-1/2 top-90 md:top-116 -z-10 mx-auto size-[800px] rounded-full border p-16 [mask-image:linear-gradient(to_top,transparent,transparent,white,white,white,transparent,transparent)] md:size-[1300px] md:p-32"
        aria-hidden
      >
        <div className="size-full rounded-full border p-16 md:p-32">
          <div className="size-full rounded-full border"></div>
        </div>
      </div>
        <div className="mx-auto max-w-2xl text-center flex flex-col gap-8 relative">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex gap-2 items-center">
              <div className="size-12 md:size-20 relative">
              <Image src="/logo.png" alt="logo" fill className="object-contain" />
              </div>
              <h2 className="text-2xl md:text-4xl font-bold">DEADLOCK TRACKER</h2>
            </div>
            <p className="text-gray-400 text-sm">
              Your source for Deadlock stats, builds, and meta insights.
            </p>
          </div>
          <div className="p-3 bg-brand/10 rounded">
            <SearchTrigger large className="bg-blk-800 hover:bg-blk-800/60" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 mt-24 gap-4 lg:gap-8 items-center">
          <PatchNotes />
          <TierlistSnippet />
          <LeaderboardsSnippet />
        </div>
      </div>
    </div>
  );
}
