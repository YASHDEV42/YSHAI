import { setRequestLocale, getTranslations } from "next-intl/server";
import { PlatformDetail } from "./components/platform-detail";
import { getConnectedAccounts } from "@/lib/helper";
import { notFound } from "next/navigation";

export default async function PlatformDetailPage({
  params,
}: {
  params: Promise<{ locale: string; platformId: string }>;
}) {
  const { locale, platformId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "PlatformDetailPage" });

  const text = {
    backToPlatforms: t("backToPlatforms"),
    back: t("back"),
    connected: t("connected"),
    disconnected: t("disconnected"),
    createPost: t("createPost"),
    tabs: {
      overview: t("tabs.overview"),
      content: t("tabs.content"),
      analytics: t("tabs.analytics"),
      aiAdvisor: t("tabs.aiAdvisor"),
    },
    overview: t("overview"),
    content: t("content"),
    analytic: t("analytic"),
    insights: t("insights"),
    stats: {
      followers: t("stats.followers"),
      posts: t("stats.posts"),
      engagement: t("stats.engagement"),
      reach: t("stats.reach"),
      fromLastMonth: t("stats.fromLastMonth"),
      fromLastWeek: t("stats.fromLastWeek"),
      thisMonth: t("stats.thisMonth"),
    },
    recentPosts: {
      title: t("recentPosts.title"),
      description: t("recentPosts.description"),
      viewAll: t("recentPosts.viewAll"),
      noPosts: t("recentPosts.noPosts"),
      noPostsDescription: t("recentPosts.noPostsDescription"),
    },
    contentLibrary: t("contentLibrary"),
    contentLibraryDescription: t("contentLibraryDescription"),
    engagement: t("engagement"),
    edit: t("edit"),
    repost: t("repost"),
    performanceChart: {
      title: t("performanceChart.title"),
      description: t("performanceChart.description"),
    },
    analytics: {
      performanceOverview: t("analytics.performanceOverview"),
      avgLikes: t("analytics.avgLikes"),
      avgComments: t("analytics.avgComments"),
      avgShares: t("analytics.avgShares"),
      bestPostTime: t("analytics.bestPostTime"),
      audienceInsights: t("analytics.audienceInsights"),
      topLocation: t("analytics.topLocation"),
      topAgeGroup: t("analytics.topAgeGroup"),
      maleAudience: t("analytics.maleAudience"),
      femaleAudience: t("analytics.femaleAudience"),
    },
    aiAdvisor: {
      title: t("aiAdvisor.title"),
      description: t("aiAdvisor.description"),
      welcomeMessage: t("aiAdvisor.welcomeMessage"),
      inputPlaceholder: t("aiAdvisor.inputPlaceholder"),
      quickAction1: t("aiAdvisor.quickAction1"),
      quickAction2: t("aiAdvisor.quickAction2"),
      quickAction3: t("aiAdvisor.quickAction3"),
      sampleResponse1: t("aiAdvisor.sampleResponse1"),
      sampleResponse2: t("aiAdvisor.sampleResponse2"),
      sampleResponse3: t("aiAdvisor.sampleResponse3"),
    },
    quickActions: {
      title: t("quickActions.title"),
      createPost: t("quickActions.createPost"),
      viewAnalytics: t("quickActions.viewAnalytics"),
      manageAccount: t("quickActions.manageAccount"),
    },
  };

  const accountsData = await getConnectedAccounts();
  const accounts = accountsData.accounts || [];

  // Extract the account ID from platformId (format: "provider-id")
  const accountId = Number.parseInt(platformId.split("-").pop() || "0");
  const account = accounts.find((acc: any) => acc.id === accountId);

  if (!account) {
    notFound();
  }

  return <PlatformDetail text={text} locale={locale} account={account} />;
}
