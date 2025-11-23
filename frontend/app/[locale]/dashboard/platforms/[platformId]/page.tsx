import { setRequestLocale } from "next-intl/server";
import { PlatformDetail } from "./components/platform-detail";
import { notFound } from "next/navigation";
import { extractPlatformDetailPageText } from "@/app/i18n/extractTexts";
import { listMyAccounts } from "@/lib/accounts-helper";
import { getInstagramPosts } from "@/lib/meta-helper";
import { Suspense } from "react";
import { routing } from "@/app/i18n/routing";

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
    <Suspense fallback={<div>loading...</div>}>
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
  console.log("Rendering PlatformDetailPage for account:", account);
  const instagramPostsResponse = await getInstagramPosts(
    account.providerAccountId,
  );
  console.log("Fetched posts response:", instagramPostsResponse);
  const posts = instagramPostsResponse.success
    ? instagramPostsResponse.data.data
    : [];

  return (
    <PlatformDetail
      text={text}
      locale={locale}
      account={account}
      posts={posts}
    />
  );
}
