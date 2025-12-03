import { setRequestLocale } from "next-intl/server";
import { routing } from "@/app/i18n/routing";
import SecurityContent from "./components/security-component";
import { extractSecurityPageText } from "@/app/i18n/extractTexts";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function SecurityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const text = await extractSecurityPageText(locale);

  return <SecurityContent text={text} locale={locale} />;
}
