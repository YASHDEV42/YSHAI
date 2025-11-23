import { extractForgotPasswordPageText } from "@/app/i18n/extractTexts";
import ForgotPasswordPage from "./components/forgot-password";
import { setRequestLocale } from "next-intl/server";

import { routing } from "@/app/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const text = await extractForgotPasswordPageText(locale);

  return <ForgotPasswordPage text={text} locale={locale} />;
}
