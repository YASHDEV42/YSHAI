import { setRequestLocale } from "next-intl/server";
import { extractLandingPageText } from "../i18n/extractTexts";
import { HeroSection } from "./components/hero-section";
import { FeatureSection } from "./components/feature-section";
import { HowItWorksSection } from "./components/how-it-works-section";
import { PricingSection } from "./components/pricing-section";
import { TestimonialsSection } from "./components/testimonials-section";
import { CtaSection } from "./components/cta-section";
import { FooterSection } from "./components/footer-section";

export default async function Home({ params }: { params: { locale: string } }) {
  const { locale } = await params;

  setRequestLocale(locale);
  const {
    HeroText,
    FeatureText,
    HowItWorksText,
    PricingText,
    TestimonialsText,
    CtaText,
    FooterText,
  } = await extractLandingPageText(locale);

  return (
    <section>
      <HeroSection text={HeroText} locale={locale} />
      <FeatureSection text={FeatureText} />
      <HowItWorksSection text={HowItWorksText} />
      <PricingSection text={PricingText} locale={locale} />
      <CtaSection text={CtaText} locale={locale} />
      <FooterSection text={FooterText} locale={locale} />
    </section>
  );
}
