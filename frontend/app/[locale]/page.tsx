import { setRequestLocale } from "next-intl/server";
import { extractLandingPageText } from "../i18n/extractTexts";
import { HeroSection } from "./components/hero-section";
import { FeatureSection } from "./components/feature-section";
import { HowItWorksSection } from "./components/how-it-works-section";
import { PricingSection } from "./components/pricing-section";
import { CtaSection } from "./components/cta-section";
import { FooterSection } from "./components/footer-section";
import LenisProvider from "@/components/LenisProvider";
import { routing } from "../i18n/routing";
export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export default async function Home({ params }: { params: { locale: string } }) {
  const { locale } = await params;

  setRequestLocale(locale);
  const {
    HeroText,
    FeatureText,
    HowItWorksText,
    PricingText,
    CtaText,
    FooterText,
  } = await extractLandingPageText(locale);

  return (
    <LenisProvider>
      <section>
        <HeroSection text={HeroText} locale={locale} />
        <FeatureSection text={FeatureText} />
        <HowItWorksSection text={HowItWorksText} />
        <PricingSection text={PricingText} locale={locale} />
        <CtaSection text={CtaText} locale={locale} />
        <FooterSection text={FooterText} locale={locale} />
      </section>
    </LenisProvider>
  );
}
