import { listCampaigns } from "@/lib/campaign-helper";
import { extractCampaignsPageText } from "@/app/i18n/extractTexts";
import CampaignsManagement from "./components/campaign-management";
import { routing } from "@/app/i18n/routing";
import { Suspense } from "react";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export default async function CampaignsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <Suspense fallback={<div>loading...</div>}>
      <CampaignsServerPage locale={locale} />
    </Suspense>
  );
}

async function CampaignsServerPage({ locale }: { locale: string }) {
  const text = await extractCampaignsPageText(locale);
  const campaignsResult = await listCampaigns(1, 100);

  const campaigns = campaignsResult.success ? campaignsResult.data || [] : [];

  return (
    <CampaignsManagement text={text} locale={locale} campaigns={campaigns} />
  );
}
