import { setRequestLocale } from "next-intl/server";
import { extractLandingPageText } from "../i18n/extractTexts";
import { HeroSection } from "./components/hero-section";
import { FeatureSection } from "./components/feature-section";
import { StatsSection } from "./components/stats-section";
import { HowItWorksSection } from "./components/how-it-works-section";
import { PricingSection } from "./components/pricing-section";
import { TestimonialsSection } from "./components/testimonials-section";
import { IntegrationsSection } from "./components/integrations-section";
import { CtaSection } from "./components/cta-section";
import { FooterSection } from "./components/footer-section";

export default async function Home({ params }: { params: { locale: string } }) {
  const { locale } = await params;

  setRequestLocale(locale);
  const {
    HeroText,
    FeatureText,
    StatsText,
    HowItWorksText,
    PricingText,
    TestimonialsText,
    IntegrationsText,
    CtaText,
    FooterText,
  } = await extractLandingPageText(locale);

  return (
    <section>
      <HeroSection text={HeroText} locale={locale} />
      {/* <StatsSection text={StatsText} /> */}
      <FeatureSection text={FeatureText} />
      <HowItWorksSection text={HowItWorksText} />
      <IntegrationsSection text={IntegrationsText} />
      <PricingSection text={PricingText} locale={locale} />
      <TestimonialsSection text={TestimonialsText} />
      <CtaSection text={CtaText} locale={locale} />
      <FooterSection text={FooterText} locale={locale} />
    </section>
  );
}
