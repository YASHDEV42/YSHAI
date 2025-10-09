import { setRequestLocale, getTranslations } from "next-intl/server";
import DashboardPage, { DashboardPageText } from "./components/dashboard";

export default async function DashboardPageRoute({
  params: { locale }
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "DashboardPage" });

  const text: DashboardPageText = {
    welcomeMessage: t("welcomeMessage"),
    welcomeSubtitle: t("welcomeSubtitle"),
    stats: {
      scheduledPosts: t("stats.scheduledPosts"),
      publishedThisWeek: t("stats.publishedThisWeek"),
      connectedAccounts: t("stats.connectedAccounts"),
      avgEngagement: t("stats.avgEngagement"),
      changeFromLastWeek: t("stats.changeFromLastWeek"),
    },
    recentActivity: {
      title: t("recentActivity.title"),
      description: t("recentActivity.description"),
      viewAll: t("recentActivity.viewAll"),
    },
    quickActions: {
      title: t("quickActions.title"),
      createPost: t("quickActions.createPost"),
      viewCalendar: t("quickActions.viewCalendar"),
      viewAnalytics: t("quickActions.viewAnalytics"),
    },
    connectedPlatforms: {
      title: t("connectedPlatforms.title"),
      description: t("connectedPlatforms.description"),
      connected: t("connectedPlatforms.connected"),
      connect: t("connectedPlatforms.connect"),
      addPlatform: t("connectedPlatforms.addPlatform"),
    },
    sidebar: {
      overview: t("sidebar.overview"),
      createPost: t("sidebar.createPost"),
      calendar: t("sidebar.calendar"),
      analytics: t("sidebar.analytics"),
      settings: t("sidebar.settings"),
    },
    user: {
      name: t("user.name"),
      email: t("user.email"),
    },
    activityStatus: {
      published: t("activityStatus.published"),
      scheduled: t("activityStatus.scheduled"),
      failed: t("activityStatus.failed"),
    },
  };

  return <DashboardPage text={text} locale={locale} />;
}
