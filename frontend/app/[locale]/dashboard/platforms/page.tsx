import { setRequestLocale } from "next-intl/server";
import { Platforms } from "./components/platforms";
import { extractPlatformsPageText } from "@/app/i18n/extractTexts";
import { listMyAccounts } from "@/lib/accounts-helper";
import { getInstagramPosts, getInstagramProfile } from "@/lib/meta-helper";

export default async function PlatformsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const text = await extractPlatformsPageText(locale);

  const accountsData = await listMyAccounts();
  const accounts = accountsData.success ? accountsData.data : [];

  const enrichedAccounts = await Promise.all(
    accounts.map(async (acc: any) => {
      if (acc.provider === "instagram" && acc.tokens?.length) {
        const pageToken = acc.tokens.find(
          (t: any) => t.tokenType === "access",
        )?.tokenEncrypted;
        const pageId = acc.pageId;

        if (pageId && pageToken) {
          const profileRes = await getInstagramProfile(pageId, pageToken);
          const postsRes = await getInstagramPosts(
            acc.providerAccountId,
            pageToken,
          );

          return {
            ...acc,
            profile: profileRes.success ? profileRes.data : null,
            posts: postsRes.success ? (postsRes.data.data ?? []) : [],
          };
        }
      }
      return acc;
    }),
  );
  return <Platforms text={text} locale={locale} accounts={enrichedAccounts} />;
}
