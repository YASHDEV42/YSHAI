import { extractForgotPasswordPageText } from "@/app/i18n/extractTexts";
import ForgotPasswordPage from "./components/forgot-password";
import { setRequestLocale } from "next-intl/server";

export const dynamic = "force-static";
export default async function Page({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const text = await extractForgotPasswordPageText(locale);

  return <ForgotPasswordPage text={text} locale={locale} />;
}
