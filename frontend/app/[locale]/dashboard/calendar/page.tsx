import { setRequestLocale } from "next-intl/server";
import CalendarPage from "./components/calendar";
import { extractCalendarPageText } from "@/app/i18n/extractTexts";
import { list as listPosts } from "@/lib/post-helper";
import { routing } from "@/app/i18n/routing";
import { Suspense } from "react";
import { CalendarSkeleton } from "@/components/skeletons/calendar-skeleton";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export default async function CalendarPageRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Suspense fallback={<CalendarSkeleton />}>
      <CalendarServerPage locale={locale} />
    </Suspense>
  );
}
async function CalendarServerPage({ locale }: { locale: string }) {
  const text = await extractCalendarPageText(locale);

  const postsResult = await listPosts({
    teamId: "",
    campaignId: "",
    scheduledFrom: "",
    scheduledTo: "",
  });

  const posts = postsResult.success ? postsResult.data : [];

  return <CalendarPage text={text} locale={locale} posts={posts} />;
}
