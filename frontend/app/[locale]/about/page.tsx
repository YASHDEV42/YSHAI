import { setRequestLocale } from "next-intl/server";
import { extractAboutPageText } from "@/app/i18n/extractTexts";
import About from "./component/about";
import LenisProvider from "@/components/LenisProvider";
import { routing } from "@/app/i18n/routing";
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const text = await extractAboutPageText(locale);

  return (
    <LenisProvider>
      <About text={text} locale={locale} />
    </LenisProvider>
  );
}
