import { setRequestLocale, getTranslations } from "next-intl/server";
import SettingsClient from "./components/settings";
import { TConnectedAccount, TUser } from "@/types";
import { getUser } from "@/lib/auth-helper";
import { getUserSocialMediaAccounts } from "@/lib/accounts-helper";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "SettingsPage" });

  const text: any = {
    title: t("title"),
    subtitle: t("subtitle"),
    tabs: {
      profile: t("tabs.profile"),
      platforms: t("tabs.platforms"),
      notifications: t("tabs.notifications"),
      billing: t("tabs.billing"),
    },
    profile: {
      title: t("profile.title"),
      description: t("profile.description"),
      changePhoto: t("profile.changePhoto"),
      photoHelp: t("profile.photoHelp"),
      name: t("profile.name"),
      email: t("profile.email"),
      bio: t("profile.bio"),
      timezone: t("profile.timezone"),
      saveChanges: t("profile.saveChanges"),
      cancel: t("profile.cancel"),
      security: {
        title: t("profile.security.title"),
        description: t("profile.security.description"),
        currentPassword: t("profile.security.currentPassword"),
        newPassword: t("profile.security.newPassword"),
        confirmPassword: t("profile.security.confirmPassword"),
        updatePassword: t("profile.security.updatePassword"),
      },
    },
    platforms: {
      title: t("platforms.title"),
      description: t("platforms.description"),
      connected: t("platforms.connected"),
      followers: t("platforms.followers"),
      reconnect: t("platforms.reconnect"),
      disconnect: t("platforms.disconnect"),
      connectNew: t("platforms.connectNew"),
      disconnected: t("platforms.disconnected"),
      postingPreferences: {
        title: t("platforms.postingPreferences.title"),
        description: t("platforms.postingPreferences.description"),
        autoPublish: {
          label: t("platforms.postingPreferences.autoPublish.label"),
          description: t(
            "platforms.postingPreferences.autoPublish.description",
          ),
        },
        watermark: {
          label: t("platforms.postingPreferences.watermark.label"),
          description: t("platforms.postingPreferences.watermark.description"),
        },
        crossPost: {
          label: t("platforms.postingPreferences.crossPost.label"),
          description: t("platforms.postingPreferences.crossPost.description"),
        },
      },
    },
    notifications: {
      title: t("notifications.title"),
      description: t("notifications.description"),
      email: {
        label: t("notifications.email.label"),
        description: t("notifications.email.description"),
      },
      push: {
        label: t("notifications.push.label"),
        description: t("notifications.push.description"),
      },
      weeklyReport: {
        label: t("notifications.weeklyReport.label"),
        description: t("notifications.weeklyReport.description"),
      },
      postReminders: {
        label: t("notifications.postReminders.label"),
        description: t("notifications.postReminders.description"),
      },
      types: {
        title: t("notifications.types.title"),
        description: t("notifications.types.description"),
        published: t("notifications.types.published"),
        failed: t("notifications.types.failed"),
        comments: t("notifications.types.comments"),
        milestones: t("notifications.types.milestones"),
        connectionIssues: t("notifications.types.connectionIssues"),
      },
    },
    billing: {
      title: t("billing.title"),
      description: t("billing.description"),
      currentPlan: t("billing.currentPlan"),
      proPlan: t("billing.proPlan"),
      proDescription: t("billing.proDescription"),
      active: t("billing.active"),
      nextBilling: t("billing.nextBilling"),
      paymentMethod: t("billing.paymentMethod"),
      changePlan: t("billing.changePlan"),
      updatePayment: t("billing.updatePayment"),
      billingHistory: t("billing.billingHistory"),
      download: t("billing.download"),
      paid: t("billing.paid"),
      dangerZone: t("billing.dangerZone"),
      dangerDescription: t("billing.dangerDescription"),
      cancelSubscription: t("billing.cancelSubscription"),
      deleteAccount: t("billing.deleteAccount"),
    },
    platformsNames: {
      twitter: t("platformsNames.twitter"),
      instagram: t("platformsNames.instagram"),
      linkedin: t("platformsNames.linkedin"),
      tiktok: t("platformsNames.tiktok"),
    },
    timezones: {
      riyadh: t("timezones.riyadh"),
      dubai: t("timezones.dubai"),
      cairo: t("timezones.cairo"),
      london: t("timezones.london"),
      newyork: t("timezones.newyork"),
    },
  };
  const data: { user?: TUser | undefined; message: string } = await getUser();
  const dataAccounts: {
    socialAccounts?: TConnectedAccount[];
    message: string;
  } = await getUserSocialMediaAccounts();
  console.log("dataAccounts:", dataAccounts);
  return (
    <SettingsClient
      locale={locale}
      text={text}
      user={data.user}
      accounts={dataAccounts.socialAccounts || []}
    />
  );
}
