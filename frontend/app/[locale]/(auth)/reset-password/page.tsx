import { extractResetPasswordPageText } from "@/app/i18n/extractTexts";
import ResetPasswordPage from "./components/reset-password";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale } = await params;
  const { token } = await searchParams;
  const text = await extractResetPasswordPageText(locale);

  return <ResetPasswordPage text={text} locale={locale} token={token || ""} />;
}
