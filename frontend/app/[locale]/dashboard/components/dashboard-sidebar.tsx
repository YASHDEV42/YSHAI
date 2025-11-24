import { getUserProfile } from "@/lib/user-helper";
import { DashboardSidebarClient } from "./dashboard-sidebar-client";
import { IUser } from "@/interfaces";

type NotificationResponseDto = {
  title: string | null;
  id: number;
  type: "approved" | "publish_failed" | "ai_ready";
  message: string;
  read: boolean;
  createdAt: string;
};

interface DashboardSidebarProps {
  locale?: string;
  text: any;
}

export async function DashboardSidebar({
  locale = "en",
  text,
}: DashboardSidebarProps) {
  const userResult = await getUserProfile();

  // If user fetch fails, provide a fallback
  const user: IUser | null = userResult.success ? userResult.data : null;

  return <DashboardSidebarClient locale={locale} text={text} user={user} />;
}
