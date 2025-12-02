import { setRequestLocale } from "next-intl/server";
import { extractSupportPageText } from "@/app/i18n/extractTexts";
import { SupportContent } from "./components/support-content";
import { routing } from "@/app/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function SupportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const text = await extractSupportPageText(locale);
  console.log("Support page text:", text);

  return <SupportContent locale={locale} text={text} />;
}
