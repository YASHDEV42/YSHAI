import { getById } from "@/lib/post-helper";
import { extractEditPostPageText } from "@/app/i18n/extractTexts";
import { redirect } from "next/navigation";
import EditPostForm from "./components/edit-post-form";
import { listMyAccounts } from "@/lib/accounts-helper";
import { listCampaigns } from "@/lib/campaign-helper";
import { getUserProfile } from "@/lib/user-helper";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ postId: string; locale: string }>;
}) {
  const { postId, locale } = await params;
  const text = await extractEditPostPageText(locale);

  const [postResult, userResult, accountsResult, campaignsResult] =
    await Promise.all([
      getById(Number(postId)),
      getUserProfile(),
      listMyAccounts(),
      listCampaigns(),
    ]);

  if (!postResult.success || !postResult.data) {
    redirect(`/${locale}/dashboard`);
  }

  if (!userResult.success || !userResult.data) {
    redirect(`/${locale}/login`);
  }

  const accounts = accountsResult.success ? accountsResult.data || [] : [];
  const campaigns = campaignsResult.success ? campaignsResult.data || [] : [];

  return (
    <EditPostForm
      post={postResult.data}
      text={text}
      locale={locale}
      user={userResult.data}
      accounts={accounts}
      campaigns={campaigns}
    />
  );
}
