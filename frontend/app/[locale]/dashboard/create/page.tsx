import { setRequestLocale, getTranslations } from "next-intl/server";
import CreatePage from "./components/create";
import { extractCreatePageText } from "@/app/i18n/extractTexts";

export default async function CreatePageRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const text = await extractCreatePageText(locale);

  return <CreatePage text={text} locale={locale} />;
}
