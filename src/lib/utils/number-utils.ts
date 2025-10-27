export function parseNumericValue(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const num = parseFloat(value.replace(/[^\d.-]/g, ""));
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${Math.round(num / 1_000)}k`;
  return num.toString();
}

export function formatStatNumber(num: number) {
  return new Intl.NumberFormat("en-US").format(num);
}