import { getUserProfile } from "@/lib/user-helper";
import { DashboardSidebarClient } from "./dashboard-sidebar-client";
import {
  getUnreadNotificationsCount,
  listNotifications,
} from "@/lib/notifications-helper";
import { IUser } from "@/interfaces";

interface DashboardSidebarProps {
  locale?: string;
  text: {
    logo?: string;
    overview?: string;
    createPost?: string;
    calendar?: string;
    platforms?: string;
    campaigns?: string;
    analytics?: string;
    settings?: string;
    notifications?: string;
    new?: string;
    markAll?: string;
    markingAll?: string;
    noNotificationsDescription?: string;
    justNow?: string;
    minutesAgo?: string;
    hoursAgo?: string;
    daysAgo?: string;
    [key: string]: any;
  };
}

export async function DashboardSidebar({
  locale = "en",
  text,
}: DashboardSidebarProps) {
  const [userResult, notificationsResult, unreadCountResult] =
    await Promise.all([
      getUserProfile(),
      listNotifications({ limit: 20 }),
      getUnreadNotificationsCount(),
    ]);

  const user: IUser | null = userResult.success ? userResult.data : null;
  const notifications = notificationsResult.success
    ? notificationsResult.data
    : [];
  console.log("Notifications Result:", notificationsResult);
  const unreadCount = unreadCountResult.success
    ? unreadCountResult.data.count
    : 0;

  return (
    <DashboardSidebarClient
      locale={locale}
      text={text}
      user={user}
      initialNotifications={notifications}
      initialUnreadCount={unreadCount}
    />
  );
}
