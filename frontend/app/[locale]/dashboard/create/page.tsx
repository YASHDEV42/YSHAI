import { setRequestLocale, getTranslations } from "next-intl/server";
import CreatePage, { CreatePageText } from "./components/create";

export default async function CreatePageRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "CreatePage" });

  const text: CreatePageText = {
    header: {
      saveDraft: t("header.saveDraft"),
      schedule: t("header.schedule"),
      publishNow: t("header.publishNow"),
    },
    aiGenerator: {
      title: t("aiGenerator.title"),
      promptLabel: t("aiGenerator.promptLabel"),
      placeholder: t("aiGenerator.placeholder"),
      generateButton: t("aiGenerator.generateButton"),
      generating: t("aiGenerator.generating"),
    },
    platforms: {
      title: t("platforms.title"),
      twitter: t("platforms.twitter"),
      instagram: t("platforms.instagram"),
      linkedin: t("platforms.linkedin"),
      tiktok: t("platforms.tiktok"),
    },
    contentEditor: {
      title: t("contentEditor.title"),
      placeholder: t("contentEditor.placeholder"),
      characters: t("contentEditor.characters"),
      twitterLimitExceeded: t("contentEditor.twitterLimitExceeded"),
    },
    media: {
      title: t("media.title"),
      uploadImage: t("media.uploadImage"),
      uploadVideo: t("media.uploadVideo"),
    },
    schedule: {
      title: t("schedule.title"),
      publishNowTab: t("schedule.publishNowTab"),
      scheduleLaterTab: t("schedule.scheduleLaterTab"),
      publishNowDescription: t("schedule.publishNowDescription"),
      dateLabel: t("schedule.dateLabel"),
      timeLabel: t("schedule.timeLabel"),
      timezoneLabel: t("schedule.timezoneLabel"),
      timezones: {
        riyadh: t("schedule.timezones.riyadh"),
        dubai: t("schedule.timezones.dubai"),
        cairo: t("schedule.timezones.cairo"),
      },
    },
    preview: {
      title: t("preview.title"),
      noContent: t("preview.noContent"),
      captionPlaceholder: t("preview.captionPlaceholder"),
      likes: t("preview.likes"),
      comments: t("preview.comments"),
      reposts: t("preview.reposts"),
      shares: t("preview.shares"),
      send: t("preview.send"),
    },
  };

  return <CreatePage text={text} locale={locale} />;
}
