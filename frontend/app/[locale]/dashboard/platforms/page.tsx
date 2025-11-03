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
  };

  const accountsData = await getConnectedAccounts();
  const accounts = accountsData.accounts || [];

  return <Platforms text={text} locale={locale} accounts={accounts} />;
}
