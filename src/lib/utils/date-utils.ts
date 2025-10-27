import { getStableTimestamps } from "@/lib/utils-old";

export function formatEpochToDate(epoch: number): string {
  const date = new Date(epoch * 1000);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function getRelativeTime(epoch: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - epoch;

  if (diff < 60) return "just now";
  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

export const formatDuration = (seconds: number): string =>
  `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;

export const getMatchTimeInfo = (
  epoch: number
): {
  formattedDate: string;
  relativeTime: string;
} => {
  return {
    formattedDate: formatEpochToDate(epoch),
    relativeTime: getRelativeTime(epoch),
  };
};

export function resolveTimeframeToUnix(timeframe?: string): number {
  const DEFAULT_PATCH_TIMESTAMP = 1759687740; 

  const { oneWeekAgoUnix, oneMonthAgoUnix } = getStableTimestamps();

  switch (timeframe) {
    case "7days":
      return oneWeekAgoUnix;
    case "30days":
      return oneMonthAgoUnix;
    default:
      return DEFAULT_PATCH_TIMESTAMP;
  }
}