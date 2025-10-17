"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { ModeToggle } from "../../../components/toggleTheme"
import {
  NotificationResponseDto,
  UserResponseDto,
} from "@/api/model"
import {
  notificationsControllerMarkAllRead,
  notificationsControllerMarkRead,
} from "@/api/notifications/notifications"

interface DashboardSidebarProps {
  locale?: string
  text: any
  user: UserResponseDto | null
}

export function DashboardSidebar({ locale = "en", text, user }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [notifications, setNotifications] = useState<NotificationResponseDto[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const isRTL = locale === "ar"
  const router = useRouter()
  useEffect(() => {
    if (!user) {
      router.replace(`/login`);
    }
  }, [])
  const unreadCount = notifications.filter((n) => !n.read).length

  const menuItems = [
    { href: "/dashboard", icon: BarChart3, label: text.overview || "Overview" },
    { href: "/dashboard/create", icon: Sparkles, label: text.createPost || "Create Post" },
    { href: "/dashboard/calendar", icon: Calendar, label: text.calendar || "Calendar" },
    { href: "/dashboard/analytics", icon: TrendingUp, label: text.analytics || "Analytics" },
    { href: "/dashboard/settings", icon: Settings, label: text.settings || "Settings" },
  ]

  const markAsRead = async (id: number) => {
    try {
      await notificationsControllerMarkRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      )
    } catch (error) {
      console.error("[DashboardSidebar] Error marking as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationsControllerMarkAllRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch (error) {
      console.error("[DashboardSidebar] Error marking all as read:", error)
    }
  }

  const getNotificationIcon = (type: NotificationResponseDto["type"]) => {
    switch (type) {
      case "approved":
      case "ai_ready":
        return <CheckCircle2 className="size-4 text-green-500" />
      case "publish_failed":
        return <AlertCircle className="size-4 text-red-500" />
      default:
        return <Info className="size-4 text-blue-500" />
    }
  }

  const getTimeAgo = (date: string): string => {
    const now = new Date()
    const notifDate = new Date(date)
    const diffInMinutes = Math.floor((now.getTime() - notifDate.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return text.justNow || "just now"
    if (diffInMinutes < 60) return `${diffInMinutes} ${text.minutesAgo || "min ago"}`
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} ${text.hoursAgo || "hours ago"}`
    return `${Math.floor(diffInMinutes / 1440)} ${text.daysAgo || "days ago"}`
  }

  return (
    <>
      {/* --- Sidebar --- */}
      <Sidebar className="border-r border-border" side={isRTL ? "right" : "left"}>
        <SidebarHeader className="border-b border-border p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="size-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">{text.logo}</span>
          </Link>
        </SidebarHeader>

        <SidebarContent className="p-4">
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link href={item.href}>
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-border p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="size-8 shrink-0">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium truncate">
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
                className="size-8 relative cursor-pointer"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="size-4" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 size-4 p-0 flex items-center justify-center text-[10px]"
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
      {showNotifications && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div
            className={cn(
              "fixed top-0 bottom-0 w-full max-w-md bg-background border-l border-border shadow-lg transition-transform duration-300",
              isRTL ? "left-0" : "right-0",
            )}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Bell className="size-5" />
                <h2 className="font-semibold text-lg">
                  {text.notifications || "Notifications"}
                </h2>
                {unreadCount > 0 && (
                  <Badge variant="secondary">
                    {unreadCount} {text.new || "new"}
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowNotifications(false)}>
                <X className="size-4" />
              </Button>
            </div>

            {notifications.length > 0 && unreadCount > 0 && (
              <div className="p-4 border-b border-border">
                <Button variant="ghost" size="sm" className="w-full" onClick={markAllAsRead}>
                  {text.markAll || "Mark all as read"}
                </Button>
              </div>
            )}

            <ScrollArea className="h-[calc(100vh-120px)]">
              <div className="p-4 space-y-2">
                {notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="size-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {text.noNotificationsDescription || "No notifications yet"}
                    </p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "p-4 rounded-lg border border-border cursor-pointer transition-colors",
                        n.read ? "bg-muted/50" : "bg-card hover:bg-muted",
                      )}
                      onClick={() => markAsRead(n.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{getNotificationIcon(n.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h3 className="font-medium text-sm">{n.title as any}</h3>
                            {!n.read && (
                              <div className="size-2 rounded-full bg-primary shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{n.message as any}</p>
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
      )}
    </>
  )
}
