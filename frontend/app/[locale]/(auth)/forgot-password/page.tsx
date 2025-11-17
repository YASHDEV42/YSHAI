import { extractForgotPasswordPageText } from "@/app/i18n/extractTexts";
import ForgotPasswordPage from "./components/forgot-password";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const text = await extractForgotPasswordPageText(locale);

  return <ForgotPasswordPage text={text} locale={locale} />;
}
