import { extractVerifyEmailPageText } from "@/app/i18n/extractTexts";
import VerifyEmailPage from "./components/verify-email";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale } = await params;
  const { token } = await searchParams;
  const text = await extractVerifyEmailPageText(locale);

  return <VerifyEmailPage text={text} locale={locale} token={token || ""} />;
}
