import { setRequestLocale, getTranslations } from "next-intl/server";
import DashboardPage from "./components/dashboard";
import { cookies } from "next/headers";
import { usersControllerGetProfile } from "@/api/users/users";
import { revalidatePath } from "next/cache";

export default async function DashboardPageRoute({
  params: { locale }
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "DashboardPage" });

  const text: any = {
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

    const response = await usersControllerGetProfile({
      headers: {
        Cookie: allCookies,
      },
    });

    if (response.status === 200) {
      user = response.data;
      console.log('Fetched user:', user);
    } else {
      console.log('User fetch failed:', response.status);
    }
  } catch (err) {
    console.log('Error fetching user:', err);
  }
  console.log("Rendering DashboardPage with locale:", locale, "and user:", user);
  return <DashboardPage text={text} locale={locale} user={user} />;
}
