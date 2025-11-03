import { setRequestLocale, getTranslations } from "next-intl/server";
import AnalyticsClient, { AnalyticsPageText } from "./components/analytics";

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "AnalyticsPage" });

  const text: AnalyticsPageText = {
    title: t("title"),
    subtitle: t("subtitle"),
    timeRangeLabel: t("timeRangeLabel"),
    timeRanges: {
      "7d": t("timeRanges.7d"),
      "30d": t("timeRanges.30d"),
      "90d": t("timeRanges.90d"),
      "1y": t("timeRanges.1y"),
    },
    stats: {
      totalEngagement: t("stats.totalEngagement"),
      totalReach: t("stats.totalReach"),
      newFollowers: t("stats.newFollowers"),
      avgEngagementRate: t("stats.avgEngagementRate"),
    },
    charts: {
      engagementOverTime: t("charts.engagementOverTime"),
      engagementOverTimeDesc: t("charts.engagementOverTimeDesc"),
      platformPerformance: t("charts.platformPerformance"),
      platformPerformanceDesc: t("charts.platformPerformanceDesc"),
    },
    platformBreakdown: {
      title: t("platformBreakdown.title"),
      description: t("platformBreakdown.description"),
      posts: t("platformBreakdown.posts"),
    },
    topPosts: {
      title: t("topPosts.title"),
      description: t("topPosts.description"),
    },
    platforms: {
      twitter: t("platforms.twitter"),
      instagram: t("platforms.instagram"),
      linkedin: t("platforms.linkedin"),
      tiktok: t("platforms.tiktok"),
    },
    metrics: {
      likes: t("metrics.likes"),
      comments: t("metrics.comments"),
      shares: t("metrics.shares"),
      views: t("metrics.views"),
      engagement: t("metrics.engagement"),
    },
  };

  return <AnalyticsClient text={text} />;
}
