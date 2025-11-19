import { setRequestLocale } from "next-intl/server";
import CreatePage from "./components/create";
import { extractCreatePageText } from "@/app/i18n/extractTexts";
import { listMyAccounts } from "@/lib/accounts-helper";
import { me } from "@/lib/user-helper";
import { redirect } from "next/navigation";
import { listTags } from "@/lib/tag-helper";
import { listCampaigns } from "@/lib/campaign-helper";

export default async function CreatePageRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const userRes = await me();
  const user = userRes.success ? userRes.data : null;
  if (!user) {
    redirect("/login");
  }
  const accountsRes = await listMyAccounts();
  const accounts = accountsRes.success ? accountsRes.data : [];

  const tagsRes = await listTags(1, 100);
  const tags = tagsRes.success ? tagsRes.data : [];
  console.log("tags", tags);

  const campaignsRes = await listCampaigns(1, 100);
  const campaigns = campaignsRes.success ? campaignsRes.data : [];
  console.log("campaigns", campaigns);

  const text = await extractCreatePageText(locale);
  return (
    <CreatePage
      text={text}
      locale={locale}
      user={user}
      accounts={accounts}
      tags={tags}
      campaigns={campaigns}
    />
  );
}
