import { getById } from "@/lib/post-helper";
import { extractEditPostPageText } from "@/app/i18n/extractTexts";
import { redirect } from "next/navigation";
import EditPostForm from "./components/edit-post-form";
import { listMyAccounts } from "@/lib/accounts-helper";
import { listTags } from "@/lib/tag-helper";
import { listCampaigns } from "@/lib/campaign-helper";
import { getUserProfile } from "@/lib/user-helper";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ postId: string; locale: string }>;
}) {
  const { postId, locale } = await params;
  const text = await extractEditPostPageText(locale);

  const [postResult, userResult, accountsResult, tagsResult, campaignsResult] =
    await Promise.all([
      getById(Number(postId)),
      getUserProfile(),
      listMyAccounts(),
      listTags(),
      listCampaigns(),
    ]);

  if (!postResult.success || !postResult.data) {
    redirect(`/${locale}/dashboard`);
  }

  if (!userResult.success || !userResult.data) {
    redirect(`/${locale}/login`);
  }

  const accounts = accountsResult.success ? accountsResult.data || [] : [];
  const tags = tagsResult.success ? tagsResult.data || [] : [];
  const campaigns = campaignsResult.success ? campaignsResult.data || [] : [];

  return (
    <EditPostForm
      post={postResult.data}
      text={text}
      locale={locale}
      user={userResult.data}
      accounts={accounts}
      tags={tags}
      campaigns={campaigns}
    />
  );
}
