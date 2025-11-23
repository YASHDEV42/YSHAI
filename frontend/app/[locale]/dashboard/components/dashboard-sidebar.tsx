"use client";

import { useState, useRef } from "react";
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
import { Link } from "@/app/i18n/navigation";

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

export function DashboardSidebar({
  locale = "en",
  text,
}: DashboardSidebarProps) {
  let user = { email: "", name: "" };
  const pathname = usePathname();
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState<NotificationResponseDto[]>(
    [],
  );
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  const [markingReadIds, setMarkingReadIds] = useState<number[]>([]);
  const isRTL = locale === "ar";
  const unreadCount = notifications.filter((n) => !n.read).length;

  const sidebarRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    {
      href: "/dashboard",
      icon: BarChart3,
      label: text.overview || "Overview",
      activeHref: "/" + locale + "/dashboard",
    },
    {
      href: "/dashboard/create",
      icon: Sparkles,
      label: text.createPost || "Create Post",
      activeHref: "/" + locale + "/dashboard/create",
    },
    {
      href: "/dashboard/calendar",
      icon: Calendar,
      label: text.calendar || "Calendar",
      activeHref: "/" + locale + "/dashboard/calendar",
    },
    {
      href: "/dashboard/platforms",
      icon: Share2,
      label: text.platforms || "Platforms",
      activeHref: "/" + locale + "/dashboard/platforms",
    },
    {
      href: "/dashboard/campaigns",
      icon: FolderKanban,
      label: text.campaigns || "Campaigns",
      activeHref: "/" + locale + "/dashboard/campaigns",
    },
    {
      href: "/dashboard/analytics",
      icon: TrendingUp,
      label: text.analytics || "Analytics",
      activeHref: "/" + locale + "/dashboard/analytics",
    },
    {
      href: "/dashboard/settings",
      icon: Settings,
      label: text.settings || "Settings",
      activeHref: "/" + locale + "/dashboard/settings",
    },
  ];

  const markAsRead = async (id: number) => {
    setMarkingReadIds((prev) => [...prev, id]);

    toast.loading("Marking as read...", {
      id: `mark-read-${id}`,
    });

    // Simulate API call
    setTimeout(() => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
      setMarkingReadIds((prev) => prev.filter((i) => i !== id));

      toast.success("Notification marked as read", {
        id: `mark-read-${id}`,
        icon: <CheckCircle2 className="h-4 w-4" />,
        duration: 1500,
      });
    }, 500);
  };

  const markAllAsRead = async () => {
    setIsMarkingAllRead(true);

    toast.loading("Marking all as read...", {
      id: "mark-all-read",
    });

    // Simulate API call with progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      // In a real app, you might update a progress state here
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100);

    // Simulate API call
    setTimeout(() => {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setIsMarkingAllRead(false);

      toast.success("All notifications marked as read", {
        id: "mark-all-read",
        icon: <CheckCircle2 className="h-4 w-4" />,
        duration: 2000,
      });
    }, 1500);
  };

  const getNotificationIcon = (type: NotificationResponseDto["type"]) => {
    switch (type) {
      case "approved":
      case "ai_ready":
        return <CheckCircle2 className="size-4 text-green-500" />;
      case "publish_failed":
        return <AlertCircle className="size-4 text-red-500" />;
      default:
        return <Info className="size-4 text-blue-500" />;
    }
  };

  const getTimeAgo = (date: string): string => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffInMinutes = Math.floor(
      (now.getTime() - notifDate.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return text.justNow || "just now";
    if (diffInMinutes < 60)
      return `${diffInMinutes} ${text.minutesAgo || "min ago"}`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} ${text.hoursAgo || "hours ago"}`;
    return `${Math.floor(diffInMinutes / 1440)} ${text.daysAgo || "days ago"}`;
  };

  return (
    <>
      {/* --- Sidebar --- */}
      <Sidebar
        ref={sidebarRef}
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
        ref={notificationsRef}
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
              <h2 className="font-semibold text-lg">
                {text.notifications || "Notifications"}
              </h2>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount} {text.new || "new"}
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
                    {text.markingAll || "Marking all as read..."}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 size-4" />
                    {text.markAll || "Mark all as read"}
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
                    {text.noNotificationsDescription || "No notifications yet"}
                  </p>
                </div>
              ) : (
                notifications.map((n, index) => (
                  <div
                    key={n.id}
                    className={cn(
                      "p-4 rounded-lg border border-border cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-md group",
                      n.read ? "bg-muted/50" : "bg-card hover:bg-muted/20",
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => markAsRead(n.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {markingReadIds.includes(n.id) ? (
                          <Loader2 className="size-4 animate-spin text-muted-foreground" />
                        ) : (
                          getNotificationIcon(n.type)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="font-medium text-sm">
                            {n.title as any}
                          </h3>
                          {!n.read && (
                            <div className="size-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {n.message as any}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getTimeAgo(n.createdAt)}
                        </p>
                      </div>
                    </div>
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
