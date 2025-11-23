import { setRequestLocale } from "next-intl/server";
import CreatePage from "./components/create";
import { extractCreatePageText } from "@/app/i18n/extractTexts";
import { listMyAccounts } from "@/lib/accounts-helper";
import { me } from "@/lib/user-helper";
import { redirect } from "next/navigation";
import { listCampaigns } from "@/lib/campaign-helper";
import { routing } from "@/app/i18n/routing";
import { Suspense } from "react";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export default async function CreatePageRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Suspense fallback={<div>loading...</div>}>
      <CreateServerPage locale={locale} />
    </Suspense>
  );
}
async function CreateServerPage({ locale }: { locale: string }) {
  const userRes = await me();
  const user = userRes.success ? userRes.data : null;
  if (!user) {
    redirect("/login");
  }
  const accountsRes = await listMyAccounts();
  const accounts = accountsRes.success ? accountsRes.data : [];

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
      campaigns={campaigns}
    />
  );
}
