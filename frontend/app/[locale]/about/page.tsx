import { setRequestLocale } from "next-intl/server";
import { extractAboutPageText } from "@/app/i18n/extractTexts";
import About from "./component/about";
import LenisProvider from "@/components/LenisProvider";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const text = await extractAboutPageText(locale);

  return (
    <LenisProvider>
      {" "}
      <About text={text} locale={locale} />
    </LenisProvider>
  );
}
