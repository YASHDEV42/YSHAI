import { setRequestLocale, getTranslations } from "next-intl/server";
import LoginPage from "./components/login";
import { extractLoginPageText } from "@/app/i18n/extractTexts";

export default async function LoginPageRoute({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  const text = await extractLoginPageText(locale);

  return <LoginPage text={text} locale={locale} />;
}
