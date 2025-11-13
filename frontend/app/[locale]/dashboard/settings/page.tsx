import { setRequestLocale } from "next-intl/server";
import SettingsClient from "./components/settings";
import { TConnectedAccount, TUser } from "@/types";
import { getUser } from "@/lib/auth-helper";
import { getUserSocialMediaAccounts } from "@/lib/accounts-helper";
import { extractSettingsPageText } from "@/app/i18n/extractTexts";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const text = await extractSettingsPageText(locale);

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
