import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  icon,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "bg-gradient-to-b from-blk-800 to-blk-900 border-b border-blk-500 shadow-2xl shadow-brand/10 px-4 xl:px-0",
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center gap-8 my-8">
        {icon && <div className="bg-blk-700 p-4 rounded">{icon}</div>}

        <div>
          <h2 className="text-4xl font-bold text-white">{title}</h2>
          {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
