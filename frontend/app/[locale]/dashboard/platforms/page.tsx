import { setRequestLocale, getTranslations } from "next-intl/server";
import { Platforms } from "./components/platforms";
import { getConnectedAccounts } from "@/lib/helper";

export default async function PlatformsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "PlatformsPage" });
  const t2 = await getTranslations({ locale, namespace: "SettingsPage" });

  const text = {
    title: t("title"),
    subtitle: t("subtitle"),
    noPlatforms: t("noPlatforms"),
    noPlatformsDescription: t("noPlatformsDescription"),
    connectPlatform: t("connectPlatform"),
    viewPlatform: t("viewPlatform"),
    connected: t("connected"),
    disconnected: t("disconnected"),
    followers: t("followers"),
    posts: t("posts"),
    engagement: t("engagement"),
    stats: {
      totalAccounts: t("stats.totalAccounts"),
      totalFollowers: t("stats.totalFollowers"),
      totalPosts: t("stats.totalPosts"),
      avgEngagement: t("stats.avgEngagement"),
    },

    platforms: {
      title: t2("platforms.title"),
      description: t2("platforms.description"),
      connected: t2("platforms.connected"),
      followers: t2("platforms.followers"),
      reconnect: t2("platforms.reconnect"),
      disconnect: t2("platforms.disconnect"),
      connectNew: t2("platforms.connectNew"),
      disconnected: t2("platforms.disconnected"),
      postingPreferences: {
        title: t2("platforms.postingPreferences.title"),
        description: t2("platforms.postingPreferences.description"),
        autoPublish: {
          label: t2("platforms.postingPreferences.autoPublish.label"),
          description: t2(
            "platforms.postingPreferences.autoPublish.description",
          ),
        },
        watermark: {
          label: t2("platforms.postingPreferences.watermark.label"),
          description: t2("platforms.postingPreferences.watermark.description"),
        },
        crossPost: {
          label: t2("platforms.postingPreferences.crossPost.label"),
          description: t2("platforms.postingPreferences.crossPost.description"),
        },
      },
    },
  };

  const accountsData = await getConnectedAccounts();
  const accounts = accountsData.accounts || [];

  return <Platforms text={text} locale={locale} accounts={accounts} />;
}
