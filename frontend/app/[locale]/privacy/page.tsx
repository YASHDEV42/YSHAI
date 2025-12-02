import { setRequestLocale } from "next-intl/server";
import { routing } from "@/app/i18n/routing";
import { extractPrivacyPolicyPageText } from "@/app/i18n/extractTexts";
import PrivacyContent from "./components/privacy-component";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const text = await extractPrivacyPolicyPageText(locale);

  return <PrivacyContent text={text} locale={locale} />;
}
