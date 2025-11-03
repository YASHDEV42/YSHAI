import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./components/dashboard-sidebar";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getUser } from "@/lib/helper";

export default async function DashboardLayout({
  children,
  params,
}: LayoutProps<"/[locale]/dashboard">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "DashboardSidebar" });
  const text = {
    overview: t("overview"),
    logo: t("logo"),
    createPost: t("createPost"),
    calendar: t("calendar"),
    platforms: t("platforms"),
    analytics: t("analytics"),
    settings: t("settings"),
    notifications: t("notifications"),
    noNotifications: t("noNotifications"),
    markAll: t("markAll"),
    new: t("new"),
    justNow: t("justNow"),
    minutesAgo: t("minutesAgo"),
    hoursAgo: t("hoursAgo"),
    daysAgo: t("daysAgo"),
  };
  let user = null;
  const data = await getUser();
  user = data.user ? data.user : null;
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar locale={locale} text={text} user={user} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}
