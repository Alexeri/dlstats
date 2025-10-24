import SectionHeader from "@/components/section-header";
import { ChartNoAxesColumnIncreasing } from "lucide-react";

export default function TierlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SectionHeader
        title="Hero Tier List"
        subtitle="Discover the latest meta trends and see which heroes are performing the best right now."
        icon={<ChartNoAxesColumnIncreasing size={50} />}
      />
      <div className="max-w-7xl mx-auto px-4 xl:px-0">{children}</div>
    </>
  );
}
