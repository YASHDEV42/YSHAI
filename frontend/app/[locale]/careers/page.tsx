import { setRequestLocale } from "next-intl/server";
import { routing } from "@/app/i18n/routing";
import CareersContent from "./components/careers-component";
import { extractCareersPageText } from "@/app/i18n/extractTexts";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const text = await extractCareersPageText(locale);

  return <CareersContent text={text} locale={locale} />;
}
