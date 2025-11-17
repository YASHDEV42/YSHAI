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

export async function extractForgotPasswordPageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.ForgotPasswordPage;
}

export async function extractResetPasswordPageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.ResetPasswordPage;
}

export async function extractVerifyEmailPageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.VerifyEmailPage;
}

export async function extractPlatformsPageText(locale: string) {
  const messages = await getMessages({ locale });
  return {
    ...messages.PlatformsPage,
    platforms: messages.SettingsPage?.platforms,
  };
}

export async function extractCampaignsPageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.CampaignsPage;
}

export async function extractTagsPageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.TagsPage;
}

export async function extractEditPostPageText(locale: string) {
  const messages = await getMessages({ locale });
  return messages.EditPostPage;
}
