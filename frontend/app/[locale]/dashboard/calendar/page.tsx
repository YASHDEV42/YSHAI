import { setRequestLocale, getTranslations } from "next-intl/server";
import CalendarPage from "./components/calendar";

export default async function CalendarPageRoute({
  params: { locale }
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "CalendarPage" });

  const text: any = {
    title: t("title"),
    subtitle: t("subtitle"),
    filterButton: t("filterButton"),
    newPostButton: t("newPostButton"),
    views: {
      month: t("views.month"),
      week: t("views.week"),
      list: t("views.list"),
    },
    platforms: {
      twitter: t("platforms.twitter"),
      instagram: t("platforms.instagram"),
      linkedin: t("platforms.linkedin"),
      tiktok: t("platforms.tiktok"),
    },
    selectedDate: {
      title: t("selectedDate.title"),
      noPosts: t("selectedDate.noPosts"),
      schedulePost: t("selectedDate.schedulePost"),
    },
    postActions: {
      edit: t("postActions.edit"),
      duplicate: t("postActions.duplicate"),
      delete: t("postActions.delete"),
    },
    status: {
      scheduled: t("status.scheduled"),
    },
    weekDays: t.raw("weekDays"),
    allScheduledPosts: t("allScheduledPosts"),
  };

  return <CalendarPage text={text} />;
}
