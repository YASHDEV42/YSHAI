import { setRequestLocale } from "next-intl/server";
import { Platforms } from "./components/platforms";
import {
  getInstagramPostsAction,
  getInstagramProfileAction,
  getUserSocialMediaAccounts,
} from "@/lib/accounts-helper";
import { extractPlatformsPageText } from "@/app/i18n/extractTexts";

export default async function PlatformsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const text = await extractPlatformsPageText(locale);

  const accountsData = await getUserSocialMediaAccounts();
  const accounts = accountsData.socialAccounts || [];

  const enrichedAccounts = await Promise.all(
    accounts.map(async (acc: any) => {
      if (acc.provider === "instagram" && acc.tokens?.length) {
        const pageToken = acc.tokens.find(
          (t: any) => t.tokenType === "access",
        )?.tokenEncrypted;
        const pageId = acc.pageId;

        if (pageId && pageToken) {
          const profileRes = await getInstagramProfileAction(pageId, pageToken);
          const postsRes = await getInstagramPostsAction(
            acc.providerAccountId,
            pageToken,
          );

          return {
            ...acc,
            profile: profileRes.success ? profileRes.profile : null,
            posts: postsRes.success ? (postsRes.posts.data ?? []) : [],
          };
        }
      }
      return acc;
    }),
  );
  return <Platforms text={text} locale={locale} accounts={enrichedAccounts} />;
}
