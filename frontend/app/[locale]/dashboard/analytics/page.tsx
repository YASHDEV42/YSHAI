import { setRequestLocale } from "next-intl/server";
import AnalyticsClient from "./components/analytics";
import { extractAnalyticsPageText } from "@/app/i18n/extractTexts";

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const text = await extractAnalyticsPageText(locale);

  return <AnalyticsClient text={text} />;
}
