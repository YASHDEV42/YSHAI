import { setRequestLocale } from "next-intl/server";
import { extractDashboardText } from "@/app/i18n/extractTexts";
import { getDashboardStats } from "@/lib/analytics-helper";
import { listMyAccounts } from "@/lib/accounts-helper";
import { list as listPosts } from "@/lib/post-helper";
import { routing } from "@/app/i18n/routing";
import { Suspense } from "react";
import DashboardPage from "./components/dashboard";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function DashboardPageRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardServerPage locale={locale} />
    </Suspense>
  );
}

async function DashboardServerPage({ locale }: { locale: string }) {
  const text = await extractDashboardText(locale);

  const [statsResult, accountsResult, postsResult] = await Promise.all([
    getDashboardStats(),
    listMyAccounts(),
    listPosts({
      teamId: "",
      campaignId: "",
      scheduledFrom: "",
      scheduledTo: "",
    }),
  ]);
  return (
    <DashboardPage
      text={text}
      locale={locale}
      stats={statsResult.success ? statsResult.data : undefined}
      accounts={accountsResult.success ? accountsResult.data : []}
      recentPosts={postsResult.success ? postsResult.data : []}
    />
  );
}
