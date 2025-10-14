
import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "./components/dashboard-sidebar"
import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function DashboardLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode,
  params: { locale: string }
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "DashboardSidebar" });
  const text = {
    overview: t("overview"),
    createPost: t("createPost"),
    calendar: t("calendar"),
    analytics: t("analytics"),
    settings: t("settings"),
    notifications: t("notifications"),
    noNotificationsDescription: t("notificationsDescription"),
    markAll: t("markAll"),
    new: t("new"),
    justNow: t("justNow"),
    minutesAgo: t("minutesAgo"),
    hoursAgo: t("hoursAgo"),
    daysAgo: t("daysAgo"),
  }
  console.log('text', text);
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar locale={locale} text={text} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  )
}
