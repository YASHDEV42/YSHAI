import { use } from "react"
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from 'next-intl';
export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('HomePage');
  return (
    <div>
      <h1>{t("title")}</h1>
    </div>
  );
}
