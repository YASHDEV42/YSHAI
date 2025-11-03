import { setRequestLocale, getTranslations } from "next-intl/server";
import { HeroSection } from "./components/hero-section";
import { FeatureSection } from "./components/feature-section";
import { PricingSection } from "./components/pricing-section";
import { CtaSection } from "./components/cta-section";
import { FooterSection } from "./components/footer-section";

export default async function Home({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Load translations on the server
  const [tHero, tFeature, tPricing, tCta, tFooter] = await Promise.all([
    await getTranslations("HeroSection"),
    await getTranslations("FeatureSection"),
    await getTranslations("PricingSection"),
    await getTranslations("CtaSection"),
    await getTranslations("FooterSection"),
  ]);
  // Prepare texts for client components
  const heroText = {
    heading: tHero("heading"),
    subHeading: tHero("subHeading"),
    primaryButton: tHero("primaryButton"),
    secondaryButton: tHero("secondaryButton"),
    highlight: tHero("highlight"),
  };

  const featureText = {
    badge: tFeature("badge"),
    heading: tFeature("heading"),
    subHeading: tFeature("subHeading"),
    features: {
      ai: {
        title: tFeature("features.ai.title"),
        description: tFeature("features.ai.description"),
      },
      schedule: {
        title: tFeature("features.schedule.title"),
        description: tFeature("features.schedule.description"),
      },
      analytics: {
        title: tFeature("features.analytics.title"),
        description: tFeature("features.analytics.description"),
      },
      team: {
        title: tFeature("features.team.title"),
        description: tFeature("features.team.description"),
      },
      publish: {
        title: tFeature("features.publish.title"),
        description: tFeature("features.publish.description"),
      },
      rtl: {
        title: tFeature("features.rtl.title"),
        description: tFeature("features.rtl.description"),
      },
    },
  };
  const pricingText = {
    badge: tPricing("badge"),
    heading: tPricing("heading"),
    subHeading: tPricing("subHeading"),
    plans: {
      free: {
        title: tPricing("plans.free.title"),
        price: tPricing("plans.free.price"),
        period: tPricing("plans.free.period"),
        features: tPricing.raw("plans.free.features"),
        button: tPricing("plans.free.button"),
      },
      pro: {
        title: tPricing("plans.pro.title"),
        price: tPricing("plans.pro.price"),
        period: tPricing("plans.pro.period"),
        features: tPricing.raw("plans.pro.features"),
        button: tPricing("plans.pro.button"),
        badge: tPricing("plans.pro.badge"),
      },
      business: {
        title: tPricing("plans.business.title"),
        price: tPricing("plans.business.price"),
        period: tPricing("plans.business.period"),
        features: tPricing.raw("plans.business.features"),
        button: tPricing("plans.business.button"),
      },
    },
  };
  const ctaText = {
    heading: tCta("heading"),
    subHeading: tCta("subHeading"),
    primaryButton: tCta("primaryButton"),
    secondaryButton: tCta("secondaryButton"),
  };
  const footerText = {
    description: tFooter("description"),
    product: {
      title: tFooter("product.title"),
      features: tFooter("product.features"),
      pricing: tFooter("product.pricing"),
      api: tFooter("product.api"),
      integrations: tFooter("product.integrations"),
    },
    company: {
      title: tFooter("company.title"),
      about: tFooter("company.about"),
      blog: tFooter("company.blog"),
      careers: tFooter("company.careers"),
      contact: tFooter("company.contact"),
    },
    legal: {
      title: tFooter("legal.title"),
      privacy: tFooter("legal.privacy"),
      terms: tFooter("legal.terms"),
      security: tFooter("legal.security"),
    },
    copyright: tFooter("copyright"),
  };

  return (
    <section>
      <HeroSection text={heroText} locale={locale} />
      <FeatureSection text={featureText} />
      <PricingSection text={pricingText} locale={locale} />
      <CtaSection text={ctaText} locale={locale} />
      <FooterSection text={footerText} locale={locale} />
    </section>
  );
}
