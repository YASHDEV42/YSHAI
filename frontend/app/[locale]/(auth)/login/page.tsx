import { setRequestLocale, getTranslations } from "next-intl/server";
import LoginPage from "./components/login";
import { extractLoginPageText } from "@/app/i18n/extractTexts";

export const dynamic = "force-static";
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
