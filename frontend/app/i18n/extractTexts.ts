"use server";

import { getMessages } from "next-intl/server";

export async function extractNavbarText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.Navbar as Record<string, any>;
}

export async function extractLandingPageText(locale: string) {
  const messages = await getMessages({ locale });
  return {
    HeroText: messages.HeroSection,
    FeatureText: messages.FeatureSection,
    StatsText: messages.StatsSection,
    HowItWorksText: messages.HowItWorksSection,
    PricingText: messages.PricingSection,
    TestimonialsText: messages.TestimonialsSection,
    IntegrationsText: messages.IntegrationsSection,
    CtaText: messages.CtaSection,
    FooterText: messages.FooterSection,
  };
}
export async function extractPrivacyPolicyPageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.PrivacyPolicy as Record<string, any>;
}
export async function extractTermsOfServicePageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.TermsOfService as Record<string, any>;
}
export async function extractSupportPageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.Support as Record<string, any>;
}

export async function extractCreatePageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.CreatePage as Record<string, any>;
}

export async function extractDashboardText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.DashboardPage as Record<string, any>;
}

export async function extractSidebarText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.DashboardSidebar as Record<string, any>;
}

export async function extractCalendarPageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.CalendarPage as Record<string, any>;
}

export async function extractAnalyticsPageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.AnalyticsPage as Record<string, any>;
}

export async function extractSettingsPageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.SettingsPage as Record<string, any>;
}

export async function extractPlatformDetailPageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.PlatformDetailPage as Record<string, any>;
}

export async function extractSignUpPageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.SignUpPage as Record<string, any>;
}

export async function extractLoginPageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.LoginPage as Record<string, any>;
}

export async function extractForgotPasswordPageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.ForgotPasswordPage as Record<string, any>;
}

export async function extractResetPasswordPageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.ResetPasswordPage as Record<string, any>;
}

export async function extractVerifyEmailPageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.VerifyEmailPage as Record<string, any>;
}

export async function extractPlatformsPageText(locale: string) {
  const messages = await getMessages({ locale });
  return {
    ...messages.PlatformsPage,
    platforms: messages.SettingsPage?.platforms,
  } as Record<string, any>;
}

export async function extractCampaignsPageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.CampaignsPage as Record<string, any>;
}

export async function extractEditPostPageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.EditPostPage as Record<string, any>;
}

export async function extractFeatureDetailText(
  locale: string,
  feature: string,
) {
  const messages = (await getMessages({ locale })) as any;
  const featureData = messages?.FeatureDetailPages?.[feature];

  if (!featureData) {
    return {
      badge: "",
      title: "",
      description: "",
      cta: "",
      benefitsHeading: "",
      benefitsSubheading: "",
      benefits: [],
      howItWorksHeading: "",
      howItWorksSubheading: "",
      steps: [],
      ctaHeading: "",
      ctaSubheading: "",
    };
  }

  return featureData;
}

export async function extractAboutPageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.AboutPage as Record<string, any>;
}
