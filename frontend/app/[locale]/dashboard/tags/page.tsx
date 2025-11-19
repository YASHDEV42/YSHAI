import { listTags } from "@/lib/tag-helper";
import { extractTagsPageText } from "@/app/i18n/extractTexts";
import TagsManagement from "./components/tags-management";

export default async function TagsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const text = await extractTagsPageText(locale);
  const tagsResult = await listTags(1, 100, "");

  const tags = tagsResult.success ? tagsResult.data || [] : [];

  return <TagsManagement text={text} locale={locale} tags={tags} />;
}
