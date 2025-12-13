import { setRequestLocale } from "next-intl/server";
import { Platforms } from "./components/platforms";
import { extractPlatformsPageText } from "@/app/i18n/extractTexts";
import { listMyAccounts } from "@/lib/accounts-helper";
import {
  getInstagramPosts,
  getInstagramProfile,
  getPageFromIgAccount,
} from "@/lib/meta-helper";
import { routing } from "@/app/i18n/routing";
import { Suspense } from "react";
import { PlatformsSkeleton } from "@/components/skeletons/platforms-skeleton";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function PlatformsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Suspense fallback={<PlatformsSkeleton />}>
      <PlatformsServerPage locale={locale} />
    </Suspense>
  );
}

async function PlatformsServerPage({ locale }: { locale: string }) {
  const text = await extractPlatformsPageText(locale);

  const accountsData = await listMyAccounts();
  const accounts = accountsData.success ? accountsData.data : [];
  // Here we get user accounts
  // {
  //   id: 1,
  //   provider: 'instagram',
  //   providerAccountId: 'example',
  //   active: true,
  //   followersCount: 2,
  //   username: 'yshai.ar',
  //   profilePictureUrl: 'example',
  //   disconnectedAt: null,
  //   tokens: [ [Object], [Object], [Object], [Object] ]
  // }

  const enrichedAccounts = await Promise.all(
    accounts.map(async (acc: any) => {
      if (acc.provider === "instagram" && acc.tokens?.length) {
        const pageToken = acc.tokens.find(
          (t: any) => t.tokenType === "access",
        )?.tokenEncrypted;
        const igUserId = acc.providerAccountId;
        const pageRes = await getPageFromIgAccount(igUserId);
        const pageId = pageRes.success ? pageRes.data?.pageId : null;

        const profileRes =
          pageId && pageToken
            ? await getInstagramProfile(pageId, pageToken)
            : { success: false, data: null };

        return {
          ...acc,
          profile: profileRes.success ? profileRes.data : null,
        };
      }
      return acc;
    }),
  );
  console.log("Enriched Accounts:", enrichedAccounts);
  return <Platforms text={text} locale={locale} accounts={enrichedAccounts} />;
}
