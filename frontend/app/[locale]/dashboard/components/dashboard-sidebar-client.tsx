"use client";

import type React from "react";
import { useState, useMemo, useCallback, memo } from "react";
import { Link } from "@/app/i18n/navigation";
import { usePathname } from "next/navigation";
import {
  Calendar,
  TrendingUp,
  BarChart3,
  Settings,
  Sparkles,
  Bell,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  Share2,
  FolderKanban,
  Activity,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../../../components/toggleTheme";
import { LanguageToggle } from "@/app/components/LanguageToggle";
import Image from "next/image";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import type { IUser } from "@/interfaces";
import type { INotification } from "@/lib/notifications-helper";
import {
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "@/lib/notifications-helper";

interface DashboardSidebarClientProps {
  locale: string;
  text: any;
  user: IUser | null;
  initialNotifications: INotification[];
  initialUnreadCount: number;
}

type LocalizedField = {
  value: Record<string, string>;
};

function getLocalizedText(
  field: LocalizedField | null | undefined,
  locale: string,
): string {
  if (!field?.value) return "";
  return (
    field.value[locale] ??
    field.value.en ??
    field.value.ar ??
    Object.values(field.value)[0] ??
    ""
  );
}

interface NotificationItemProps {
  notification: INotification;
  locale: string;
  isMarkingRead: boolean;
  isDeleting: boolean;
  onMarkRead: (id: number) => void;
  onDelete: (id: number, e: React.MouseEvent) => void;
  getTimeAgo: (date: string) => string;
  getNotificationIcon: (type: INotification["type"]) => React.ReactNode;
}

const NotificationItem = memo(function NotificationItem({
  notification,
  locale,
  isMarkingRead,
  isDeleting,
  onMarkRead,
  onDelete,
  getTimeAgo,
  getNotificationIcon,
}: NotificationItemProps) {
  const title = getLocalizedText(notification.title as any, locale);
  const message = getLocalizedText(notification.message as any, locale);

  return (
    <div
      className={cn(
        "p-4 rounded-lg border border-border cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-md group relative",
        notification.read ? "bg-muted/50" : "bg-card hover:bg-muted/20",
      )}
      onClick={() => onMarkRead(notification.id)}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {isMarkingRead ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : (
            getNotificationIcon(notification.type)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-medium text-sm">{title}</h3>
            <div className="flex items-center gap-1">
              {!notification.read && (
                <div className="size-2 rounded-full bg-primary" />
              )}
              <Button
                variant="ghost"
                size="icon"
                className="size-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => onDelete(notification.id, e)}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Trash2 className="size-3 text-muted-foreground hover:text-destructive" />
                )}
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">{message}</p>
          <p className="text-xs text-muted-foreground">
            {getTimeAgo(notification.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
});

export function DashboardSidebarClient({
  locale,
  text,
  user,
  initialNotifications,
  initialUnreadCount,
}: DashboardSidebarClientProps) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [notifications, setNotifications] =
    useState<INotification[]>(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  const [markingReadIds, setMarkingReadIds] = useState<number[]>([]);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const isRTL = locale === "ar";

  const menuItems = useMemo(
    () => [
      {
        href: "/dashboard",
        icon: BarChart3,
        label: text.overview,
        activeHref: `/${locale}/dashboard`,
      },
      {
        href: "/dashboard/create",
        icon: Sparkles,
        label: text.createPost,
        activeHref: `/${locale}/dashboard/create`,
      },
      {
        href: "/dashboard/calendar",
        icon: Calendar,
        label: text.calendar,
        activeHref: `/${locale}/dashboard/calendar`,
      },
      {
        href: "/dashboard/platforms",
        icon: Share2,
        label: text.platforms,
        activeHref: `/${locale}/dashboard/platforms`,
      },
      {
        href: "/dashboard/campaigns",
        icon: FolderKanban,
        label: text.campaigns,
        activeHref: `/${locale}/dashboard/campaigns`,
      },
      {
        href: "/dashboard/analytics",
        icon: TrendingUp,
        label: text.analytics,
        activeHref: `/${locale}/dashboard/analytics`,
      },
      {
        href: "/dashboard/settings",
        icon: Settings,
        label: text.settings,
        activeHref: `/${locale}/dashboard/settings`,
      },
    ],
    [locale, text],
  );

  const getNotificationIcon = useCallback((type: INotification["type"]) => {
    switch (type) {
      case "post.published":
      case "analytics.updated":
        return <CheckCircle2 className="size-4 text-green-500" />;
      case "post.failed":
        return <AlertCircle className="size-4 text-red-500" />;
      case "subscription.ending":
        return <AlertCircle className="size-4 text-orange-500" />;
      default:
        return <Info className="size-4 text-blue-500" />;
    }
  }, []);

  const getTimeAgo = useCallback(
    (date: string): string => {
      const now = new Date();
      const notifDate = new Date(date);
      const diffInMinutes = Math.floor(
        (now.getTime() - notifDate.getTime()) / (1000 * 60),
      );

      if (diffInMinutes < 1) return text.justNow;
      if (diffInMinutes < 60) return `${diffInMinutes} ${text.minutesAgo}`;
      if (diffInMinutes < 1440)
        return `${Math.floor(diffInMinutes / 60)} ${text.hoursAgo}`;
      return `${Math.floor(diffInMinutes / 1440)} ${text.daysAgo}`;
    },
    [text.justNow, text.minutesAgo, text.hoursAgo, text.daysAgo],
  );

  const markAsRead = useCallback(
    async (id: number) => {
      const target = notifications.find((n) => n.id === id);
      if (!target || target.read) return;

      setMarkingReadIds((prev) => [...prev, id]);

      toast.loading(text.toasts.markingAsRead, {
        id: `mark-read-${id}`,
      });

      const result = await markNotificationRead(id);

      if (result.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));

        toast.success(text.toasts.markedAsRead, {
          id: `mark-read-${id}`,
          icon: <CheckCircle2 className="h-4 w-4" />,
          duration: 1500,
        });
      } else {
        toast.error(text.toasts.failed, {
          id: `mark-read-${id}`,
          duration: 2000,
        });
      }

      setMarkingReadIds((prev) => prev.filter((i) => i !== id));
    },
    [
      notifications,
      text.toasts.markingAsRead,
      text.toasts.markedAsRead,
      text.toasts.failed,
    ],
  );

  const markAllAsRead = useCallback(async () => {
    if (unreadCount === 0) return;

    setIsMarkingAllRead(true);

    toast.loading(text.toasts.markingAllAsRead, {
      id: "mark-all-read",
    });

    const result = await markAllNotificationsRead();

    if (result.success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);

      toast.success(text.toasts.allMarkedAsRead, {
        id: "mark-all-read",
        icon: <CheckCircle2 className="h-4 w-4" />,
        duration: 2000,
      });
    } else {
      toast.error(text.toasts.failed, {
        id: "mark-all-read",
        duration: 2000,
      });
    }

    setIsMarkingAllRead(false);
  }, [
    unreadCount,
    text.toasts.markingAllAsRead,
    text.toasts.allMarkedAsRead,
    text.toasts.failed,
  ]);

  const deleteNotificationHandler = useCallback(
    async (id: number, e: React.MouseEvent) => {
      e.stopPropagation();

      setDeletingIds((prev) => [...prev, id]);

      toast.loading(text.toasts.deleting, {
        id: `delete-${id}`,
      });

      const result = await deleteNotification(id);

      if (result.success) {
        const notification = notifications.find((n) => n.id === id);
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        if (notification && !notification.read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }

        toast.success(text.toasts.deleted, {
          id: `delete-${id}`,
          duration: 1500,
        });
      } else {
        toast.error(text.toasts.failed, {
          id: `delete-${id}`,
          duration: 2000,
        });
      }

      setDeletingIds((prev) => prev.filter((i) => i !== id));
    },
    [
      notifications,
      text.toasts.deleting,
      text.toasts.deleted,
      text.toasts.failed,
    ],
  );

  return (
    <>
      {/* --- Sidebar --- */}
      <Sidebar
        className={cn(
          "border-r border-border transition-all duration-300",
          showNotifications && "opacity-50",
        )}
        side={isRTL ? "right" : "left"}
      >
        <SidebarHeader className="border-b border-border p-6 flex items-center justify-between flex-row">
          <Link
            href="/"
            className="flex items-center gap-2 px-2 transition-all duration-300 hover:scale-105"
          >
            <span className="font-bold text-xl text-foreground flex flex-row items-center justify-center gap-2">
              {theme === "dark" ? (
                <Image
                  src="/bitmap-dark.svg"
                  alt="Logo"
                  width={30}
                  height={30}
                  className="transition-all duration-300 hover:rotate-12"
                />
              ) : (
                <Image
                  src="/bitmap.svg"
                  alt="Logo"
                  width={30}
                  height={30}
                  className="transition-all duration-300 hover:rotate-12"
                />
              )}
              {text.logo}
            </span>
          </Link>
          <LanguageToggle />
        </SidebarHeader>

        <SidebarContent className="p-4">
          <SidebarMenu>
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.activeHref;

              return (
                <SidebarMenuItem key={item.href} className="mb-1">
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "py-5 transition-all duration-100 hover:scale-105",
                      isActive && "bg-primary/10 border-primary/20",
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 w-full"
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/10",
                        )}
                      >
                        <Icon className="size-5 transition-all duration-300 group-hover:scale-110" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-border p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex flex-col min-w-0">
                <span className="font-medium text-sm truncate transition-colors hover:text-foreground">
                  {user?.name || "User"}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {user?.email || "user@example.com"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="size-8 relative transition-all duration-300 hover:scale-110 hover:bg-primary/10"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="size-4" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 size-5 p-0 flex items-center justify-center text-[10px] animate-pulse"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
              <ModeToggle />
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* --- Notifications Drawer --- */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity duration-150",
          showNotifications ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setShowNotifications(false)}
      >
        <div
          className={cn(
            "fixed top-0 bottom-0 w-full max-w-md bg-background border-l border-border shadow-lg transition-transform duration-300 overflow-hidden",
            isRTL ? "left-0" : "right-0",
            showNotifications
              ? "translate-x-0"
              : isRTL
                ? "translate-x-full"
                : "-translate-x-full",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Activity className="size-5 text-primary" />
              <h2 className="font-semibold text-lg">{text.notifications}</h2>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount} {text.new}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(false)}
              className="transition-all duration-300 hover:scale-110"
            >
              <X className="size-4" />
            </Button>
          </div>

          {notifications.length > 0 && unreadCount > 0 && (
            <div className="p-4 border-b border-border">
              <Button
                variant="ghost"
                size="sm"
                className="w-full transition-all duration-300 hover:scale-105"
                onClick={markAllAsRead}
                disabled={isMarkingAllRead}
              >
                {isMarkingAllRead ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    {text.markingAll}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 size-4" />
                    {text.markAll}
                  </>
                )}
              </Button>
            </div>
          )}

          <ScrollArea className="h-[calc(100vh-120px)]">
            <div className="p-4 space-y-2">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="size-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    {text.noNotificationsDescription}
                  </p>
                </div>
              ) : (
                notifications.map((n, index) => (
                  <div key={n.id} style={{ animationDelay: `${index * 50}ms` }}>
                    <NotificationItem
                      notification={n}
                      locale={locale}
                      isMarkingRead={markingReadIds.includes(n.id)}
                      isDeleting={deletingIds.includes(n.id)}
                      onMarkRead={markAsRead}
                      onDelete={deleteNotificationHandler}
                      getTimeAgo={getTimeAgo}
                      getNotificationIcon={getNotificationIcon}
                    />
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
