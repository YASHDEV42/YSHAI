import { setRequestLocale } from "next-intl/server";
import { routing } from "@/app/i18n/routing";
import BlogContent from "./components/blog-component";
import { extractBlogPageText } from "@/app/i18n/extractTexts";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const text = await extractBlogPageText(locale);

  return <BlogContent text={text} locale={locale} />;
}
