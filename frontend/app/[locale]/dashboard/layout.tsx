
import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "./components/dashboard-sidebar"
import { setRequestLocale, getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { usersControllerGetProfile } from "@/api/users/users";

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
    noNotifications: t("noNotifications"),
    markAll: t("markAll"),
    new: t("new"),
    justNow: t("justNow"),
    minutesAgo: t("minutesAgo"),
    hoursAgo: t("hoursAgo"),
    daysAgo: t("daysAgo"),
  }

  let allCookies = '';
  let user = null;
  try {
    const cookieStore = await cookies();
    allCookies = cookieStore.toString();

    const response = await usersControllerGetProfile({
      headers: {
        Cookie: allCookies,
      },
    });

    if (response.status === 200) {
      user = response.data;
    } else {
      console.log('User fetch failed:', response.status);
    }
  } catch (err) {
    console.log('Error fetching user:', err);
  }
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar locale={locale} text={text} user={user} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  )
}
