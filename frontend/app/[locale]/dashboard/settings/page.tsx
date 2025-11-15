import { setRequestLocale } from "next-intl/server";
import SettingsClient from "./components/settings";
import { TConnectedAccount, TUser } from "@/types";
import { extractSettingsPageText } from "@/app/i18n/extractTexts";
import { me } from "@/lib/user-helper";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const text = await extractSettingsPageText(locale);

  const response = await me();
  const user = response.success ? (response.data as TUser) : undefined;
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
    />
  );
}
