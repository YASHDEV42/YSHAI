import { setRequestLocale, getTranslations } from "next-intl/server";
import LoginPage from "./components/login";
import { extractLoginPageText } from "@/app/i18n/extractTexts";
import { routing } from "@/app/i18n/routing";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export default async function LoginPageRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const text = await extractLoginPageText(locale);

  return <LoginPage text={text} locale={locale} />;
}
