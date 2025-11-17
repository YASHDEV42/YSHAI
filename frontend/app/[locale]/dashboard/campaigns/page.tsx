import { listCampaigns } from "@/lib/campaign-helper";
import { extractCampaignsPageText } from "@/app/i18n/extractTexts";
import CampaignsManagement from "./components/campaign-management";

export default async function CampaignsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const text = await extractCampaignsPageText(locale);
  const campaignsResult = await listCampaigns();

  const campaigns = campaignsResult.success ? campaignsResult.data || [] : [];

  return (
    <CampaignsManagement text={text} locale={locale} campaigns={campaigns} />
  );
}
