import { extractSignUpPageText } from "@/app/i18n/extractTexts";
import SignUpPage from "./components/signup";
import { setRequestLocale } from "next-intl/server";

import { routing } from "@/app/i18n/routing";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
const page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const text = await extractSignUpPageText(locale);
  return <SignUpPage text={text} locale={locale} />;
};

export default page;
