import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "../i18n/navigation";

export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale); // Set locale for server-side translations
  const t = useTranslations("HomePage");
  console.log("Rendering HomePage");
  const targetLocale = locale === "en" ? "ar" : "en";
  console.log("Current locale:", locale);
  return (
    <div>
      <h1>{t("title")}</h1>
      <Link href="/" locale={targetLocale}>switch to {targetLocale}</Link>
    </div>
  );
}
