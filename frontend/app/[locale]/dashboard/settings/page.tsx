import { setRequestLocale } from "next-intl/server";
import SettingsClient from "./components/settings";
import type { TConnectedAccount, TUser } from "@/types";
import { extractSettingsPageText } from "@/app/i18n/extractTexts";
import { me } from "@/lib/user-helper";
import { fetchSubscriptionData } from "./actions";
import { Suspense } from "react";
import { routing } from "@/app/i18n/routing";
import { SettingsSkeleton } from "@/components/skeletons/settings-skeleton";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsServerPage locale={locale} />
    </Suspense>
  );
}
async function SettingsServerPage({ locale }: { locale: string }) {
  const text = await extractSettingsPageText(locale);

  const [userResponse, subscriptionData] = await Promise.all([
    me(),
    fetchSubscriptionData(),
  ]);

  const user = userResponse.success ? (userResponse.data as TUser) : undefined;
  const dataAccounts = {
    socialAccounts: [] as TConnectedAccount[],
  };
  // const dataAccounts: {
  //   socialAccounts?: TConnectedAccount[];
  //   message: string;
  // } = await getUserSocialMediaAccounts();
  // console.log("dataAccounts:", dataAccounts);
  return (
    <SettingsClient
      locale={locale}
      text={text}
      user={user}
      accounts={dataAccounts.socialAccounts || []}
      subscription={subscriptionData.subscription}
      plans={subscriptionData.plans}
      invoices={subscriptionData.invoices}
    />
  );
}
