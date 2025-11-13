import { setRequestLocale } from "next-intl/server";
import CalendarPage from "./components/calendar";
import { extractCalendarPageText } from "@/app/i18n/extractTexts";

export default async function CalendarPageRoute({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  const text = await extractCalendarPageText(locale);

  return <CalendarPage text={text} />;
}
