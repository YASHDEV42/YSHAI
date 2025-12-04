import { TimeRange } from "./analytics-helper";

export function calculateEngagementRate(
  engagement: number,
  reach: number,
): number {
  if (reach === 0) return 0;
  return (engagement / reach) * 100;
}

export function calculateViralityScore(
  likes: number,
  comments: number,
  shares: number,
  reach: number,
): number {
  if (reach === 0) return 0;
  const weightedEngagement = likes * 1 + comments * 2 + shares * 3;
  return Math.min((weightedEngagement / reach) * 100, 100);
}

export function formatAnalyticsNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
}

export function getChangeIndicator(change: number): {
  text: string;
  color: "green" | "red" | "gray";
  icon: "up" | "down" | "neutral";
} {
  if (change > 0) {
    return { text: `+${change.toFixed(1)}%`, color: "green", icon: "up" };
  }
  if (change < 0) {
    return { text: `${change.toFixed(1)}%`, color: "red", icon: "down" };
  }
  return { text: "0%", color: "gray", icon: "neutral" };
}

export function getTimeRangeLabel(range: TimeRange): string {
  const labels: Record<TimeRange, string> = {
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    "90d": "Last 90 days",
    "1y": "Last year",
  };
  return labels[range];
}

export function isMetricHealthy(
  value: number,
  threshold: number,
  higherIsBetter = true,
): boolean {
  return higherIsBetter ? value >= threshold : value <= threshold;
}
