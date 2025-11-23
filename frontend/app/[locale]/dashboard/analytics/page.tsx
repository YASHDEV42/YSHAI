import { setRequestLocale } from "next-intl/server";
import AnalyticsClient from "./components/analytics";
import { extractAnalyticsPageText } from "@/app/i18n/extractTexts";
import {
  getAnalytics,
  getEngagementData,
  getPlatformPerformance,
  getTopPosts,
} from "@/lib/analytics-helper";
import { Suspense } from "react";

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Suspense fallback={<div>loading...</div>}>
      <AnalyticsServerPage locale={locale} />
    </Suspense>
  );
}
async function AnalyticsServerPage({ locale }: { locale: string }) {
  const text = await extractAnalyticsPageText(locale);

  const [analyticsResult, engagementResult, platformsResult, topPostsResult] =
    await Promise.all([
      getAnalytics({ timeRange: "7d" }),
      getEngagementData({ timeRange: "7d" }),
      getPlatformPerformance({ timeRange: "7d" }),

      getTopPosts({ limit: 4, timeRange: "7d" }),
    ]);

  return (
    <AnalyticsClient
      text={text}
      analytics={analyticsResult.success ? analyticsResult.data : undefined}
      engagementData={
        engagementResult.success ? engagementResult.data : undefined
      }
      platformData={platformsResult.success ? platformsResult.data : undefined}
      topPosts={topPostsResult.success ? topPostsResult.data : undefined}
    />
  );
}
