import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./components/dashboard-sidebar";
import { setRequestLocale } from "next-intl/server";
import { extractSidebarText } from "@/app/i18n/extractTexts";
import { me } from "@/lib/user-helper";

export default async function DashboardLayout({
  children,
  params,
}: LayoutProps<"/[locale]/dashboard">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const text = await extractSidebarText(locale);
  let user = null;
  const response = await me();
  user = response.success ? response.data : null;
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar locale={locale} text={text} user={user} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}
