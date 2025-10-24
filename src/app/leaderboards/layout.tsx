import SectionHeader from "@/components/section-header";
import { Swords } from "lucide-react";

export default function LeaderboardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SectionHeader
        title="Leaderboards"
        subtitle="Track the top-performing players dominating the leaderboard."
        icon={<Swords size={50} />}
      />
      <div className="max-w-7xl mx-auto px-4 xl:px-0">{children}</div>
    </>
  );
}
