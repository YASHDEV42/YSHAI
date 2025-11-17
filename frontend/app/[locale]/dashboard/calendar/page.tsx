import { setRequestLocale } from "next-intl/server";
import CalendarPage from "./components/calendar";
import { extractCalendarPageText } from "@/app/i18n/extractTexts";
import { list as listPosts } from "@/lib/post-helper";
import { listMyAccounts } from "@/lib/accounts-helper";

export default async function CalendarPageRoute({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  const text = await extractCalendarPageText(locale);

  const postsResult = await listPosts({
    teamId: "",
    campaignId: "",
    scheduledFrom: "",
    scheduledTo: "",
  });

  const accountsResult = await listMyAccounts();

  const posts = postsResult.success ? postsResult.data : [];
  const accounts = accountsResult.success ? accountsResult.data : [];

  return <CalendarPage text={text} posts={posts} accounts={accounts} />;
}
