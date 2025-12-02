import { setRequestLocale } from "next-intl/server";
import { routing } from "@/app/i18n/routing";
import TermsContent from "./components/terms-component";
import { extractTermsOfServicePageText } from "@/app/i18n/extractTexts";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const text = await extractTermsOfServicePageText(locale);

  return <TermsContent text={text} locale={locale} />;
}
