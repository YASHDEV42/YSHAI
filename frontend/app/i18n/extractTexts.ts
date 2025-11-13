"use server";

import { getMessages } from "next-intl/server";

export async function extractNavbarText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.Navbar;
}

export async function extractLandingPageText(locale: string) {
  const messages = await getMessages({ locale });
  return {
    HeroText: messages.HeroSection,
    FeatureText: messages.FeatureSection,
    PricingText: messages.PricingSection,
    CtaText: messages.CtaSection,
    FooterText: messages.FooterSection,
  };
}

export async function extractCreatePageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.CreatePage;
}

export async function extractDashboardText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.DashboardPage;
}

export async function extractSidebarText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.DashboardSidebar;
}

export async function extractCalendarPageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.CalendarPage;
}

export async function extractAnalyticsPageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.AnalyticsPage;
}

export async function extractSettingsPageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.SettingsPage;
}

export async function extractPlatformDetailPageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.PlatformDetailPage;
}

export async function extractSignUpPageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.SignUpPage;
}

export async function extractLoginPageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.LoginPage;
}

export async function extractPlatformsPageText(locale: string) {
  const messages = await getMessages({ locale });
  return {
    ...messages.PlatformsPage, // main PlatformsPage
    platforms: messages.SettingsPage?.platforms, // nested platform texts
  };
}
