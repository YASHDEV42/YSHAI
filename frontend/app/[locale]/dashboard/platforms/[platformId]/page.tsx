import { setRequestLocale } from "next-intl/server";
import { PlatformDetail } from "./components/platform-detail";
import {
  getInstagramPostsAction,
  getUserSocialMediaAccounts,
} from "@/lib/accounts-helper";
import { notFound } from "next/navigation";
import { extractPlatformDetailPageText } from "@/app/i18n/extractTexts";

export default async function PlatformDetailPage({
  params,
}: {
  params: Promise<{ locale: string; platformId: string }>;
}) {
  const { locale, platformId } = await params;
  setRequestLocale(locale);
  const text = await extractPlatformDetailPageText(locale);

  const accountsData = await getUserSocialMediaAccounts();
  const accounts = accountsData.socialAccounts || [];

  // Extract the account ID from platformId (format: "provider-id")
  const accountId = Number.parseInt(platformId.split("-").pop() || "0");
  const account = accounts.find((acc: any) => acc.id === accountId);

  if (!account) {
    notFound();
  }
  console.log("Rendering PlatformDetailPage for account:", account);
  const postsResponse = await getInstagramPostsAction(
    account.providerAccountId,
  );
  const posts = postsResponse?.posts?.data || [];

  return (
    <PlatformDetail
      text={text}
      locale={locale}
      account={account}
      posts={posts}
    />
  );
}
