import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./components/dashboard-sidebar";
import { setRequestLocale } from "next-intl/server";
import { extractSidebarText } from "@/app/i18n/extractTexts";
import { Suspense } from "react";
import { SidebarSkeleton } from "@/components/skeletons/sidebar-skeleton";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  params,
}: LayoutProps<"/[locale]/dashboard">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const text = await extractSidebarText(locale);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Suspense fallback={<SidebarSkeleton />}>
          <DashboardSidebar locale={locale} text={text} />
        </Suspense>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}
