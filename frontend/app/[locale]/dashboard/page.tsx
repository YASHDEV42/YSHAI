import { setRequestLocale } from "next-intl/server";
import DashboardPage from "./components/dashboard";
import { extractDashboardText } from "@/app/i18n/extractTexts";

export default async function DashboardPageRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const text = await extractDashboardText(locale);
  return <DashboardPage text={text} locale={locale} />;
}
