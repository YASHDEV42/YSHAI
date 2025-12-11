import { setRequestLocale } from "next-intl/server";
import VerifyEmailPage from "./components/verify-email";
import { extractVerifyEmailPageText } from "@/app/i18n/extractTexts";
import { routing } from "@/app/i18n/routing";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Page({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { token } = await searchParams;

  setRequestLocale(locale);
  const text = await extractVerifyEmailPageText(locale);

  return <VerifyEmailPage text={text} token={token ?? null} />;
}
