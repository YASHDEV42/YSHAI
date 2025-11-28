import { setRequestLocale } from "next-intl/server";
import { PlatformDetail } from "./components/platform-detail";
import { notFound } from "next/navigation";
import { extractPlatformDetailPageText } from "@/app/i18n/extractTexts";
import { listMyAccounts } from "@/lib/accounts-helper";
import { getInstagramPosts } from "@/lib/meta-helper";
import { list as listPosts } from "@/lib/post-helper";
import { Suspense } from "react";
import { routing } from "@/app/i18n/routing";
import { PlatformDetailSkeleton } from "@/components/skeletons/platform-detail-skeleton";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
    platformId: "instagram-1",
  }));
}

export default async function PlatformDetailPage({
  params,
}: {
  params: Promise<{ locale: string; platformId: string }>;
}) {
  const { locale, platformId } = await params;
  setRequestLocale(locale);
  return (
    <Suspense fallback={<PlatformDetailSkeleton />}>
      <PlatformDetailServerPage locale={locale} platformId={platformId} />
    </Suspense>
  );
}

async function PlatformDetailServerPage({
  locale,
  platformId,
}: {
  locale: string;
  platformId: string;
}) {
  const text = await extractPlatformDetailPageText(locale);

  const accountsData = await listMyAccounts();
  const accounts = accountsData.success ? accountsData.data : [];

  const accountId = Number.parseInt(platformId.split("-").pop() || "0");
  const account = accounts.find((acc: any) => acc.id === accountId);

  if (!account) {
    notFound();
  }

  const [instagramPostsResponse, databasePostsResponse] = await Promise.all([
    getInstagramPosts(account.providerAccountId),
    listPosts({
      status: ["draft", "failed", "scheduled", "pending_approval"],
      teamId: "",
      campaignId: "",
      scheduledFrom: "",
      scheduledTo: "",
    }),
  ]);

  const instagramPosts = instagramPostsResponse.success
    ? instagramPostsResponse.data.data
    : [];
  const databasePosts = databasePostsResponse.success
    ? databasePostsResponse.data
    : [];

  console.log(databasePosts);
  console.log(instagramPosts);
  const allPosts = [...databasePosts, ...instagramPosts];

  console.log("[v0] Platform content breakdown:", {
    draftsAndScheduled: databasePosts.length,
    instagramPublished: instagramPosts.length,
    total: allPosts.length,
  });

  return (
    <PlatformDetail
      text={text}
      locale={locale}
      account={account}
      posts={allPosts}
    />
  );
}
