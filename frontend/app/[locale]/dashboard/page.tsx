import { setRequestLocale, getTranslations } from "next-intl/server";
import DashboardPage, { DashboardPageText } from "./components/dashboard";
import { cookies } from "next/headers";

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

  let user = null;
  try {

    const cookieStore = await cookies();
    const allCookies = cookieStore.toString();
    const response = await fetch(`http://localhost:5000/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': allCookies,
      },
      credentials: 'include',
    })
    if (response.ok) {
      user = await response.json()
      console.log('User data:', user)
      console.log('fetched user successfully in dashboard')
    } else {
      const errorData = await response.json()
      console.log('failed to fetch user in dashboard', errorData)
    }
  } catch (err) {
    console.log('error fetching user in dashboard', err)
  }
  return <DashboardPage text={text} locale={locale} user={user} />;
}
