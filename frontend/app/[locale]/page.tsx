import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "../i18n/navigation";
import { HeroSection } from "./components/hero-section";
export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale); // Set locale for server-side translations

  const t = useTranslations("HeroSection");
  const text = {
    heading: t('heading'),
    subHeading: t('subHeading'),
    primaryButton: t('primaryButton'),
    secondaryButton: t('secondaryButton'),
    highlight: t('highlight')
  }
  const targetLocale = locale === "en" ? "ar" : "en";
  return (
    <section>
      <Link href="/" locale={targetLocale}>switch to {targetLocale}</Link>
      <HeroSection text={text} locale={locale} />
    </section>
  );
}
