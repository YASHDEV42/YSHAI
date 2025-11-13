import { setRequestLocale } from "next-intl/server";
import { extractLandingPageText } from "../i18n/extractTexts";
import { HeroSection } from "./components/hero-section";
import { FeatureSection } from "./components/feature-section";
import { PricingSection } from "./components/pricing-section";
import { CtaSection } from "./components/cta-section";
import { FooterSection } from "./components/footer-section";

export default async function Home({ params }: { params: { locale: string } }) {
  const { locale } = await params;

  setRequestLocale(locale);
  const { HeroText, FeatureText, PricingText, CtaText, FooterText } =
    await extractLandingPageText(locale);

  return (
    <section>
      <HeroSection text={HeroText} locale={locale} />
      <FeatureSection text={FeatureText} />
      <PricingSection text={PricingText} locale={locale} />
      <CtaSection text={CtaText} locale={locale} />
      <FooterSection text={FooterText} locale={locale} />
    </section>
  );
}
