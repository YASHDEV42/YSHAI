"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  Calendar,
  TrendingUp,
  Users,
  FileText,
  Plus,
  Twitter,
  Instagram,
  Linkedin,
  Music2,
  BarChart3,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { IDashboardStats } from "@/lib/analytics-helper";
import type { ISocialAccount, IPost } from "@/interfaces";

export interface DashboardPageText {
  welcomeMessage: string;
  welcomeSubtitle: string;
  stats: {
    scheduledPosts: string;
    publishedThisWeek: string;
    connectedAccounts: string;
    avgEngagement: string;
    changeFromLastWeek: string;
  };
  recentActivity: {
    title: string;
    description: string;
    viewAll: string;
  };
  quickActions: {
    title: string;
    createPost: string;
    viewCalendar: string;
    viewAnalytics: string;
  };
  connectedPlatforms: {
    title: string;
    description: string;
    connected: string;
    connect: string;
    addPlatform: string;
  };
  sidebar: {
    overview: string;
    createPost: string;
    calendar: string;
    analytics: string;
    settings: string;
  };
  user: {
    name: string;
    email: string;
  };
  activityStatus: {
    published: string;
    scheduled: string;
    failed: string;
  };
}

interface DashboardPageProps {
  text: DashboardPageText;
  locale: string;
  stats?: IDashboardStats;
  accounts: ISocialAccount[];
  recentPosts: IPost[];
}

export default function DashboardPage({
  text,
  locale,
  stats,
  accounts,
  recentPosts,
}: DashboardPageProps) {
  const statsRef = useRef<HTMLDivElement>(null);
  const activityRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);

  const dashboardStats = [
    {
      title: text.stats.scheduledPosts,
      value: stats?.scheduledPosts.toString() ?? "0",
      change: stats?.scheduledChange
        ? `${stats.scheduledChange > 0 ? "+" : ""}${stats.scheduledChange}%`
        : "+0%",
      icon: Clock,
      trend: "up" as const,
    },
    {
      title: text.stats.publishedThisWeek,
      value: stats?.publishedThisWeek.toString() ?? "0",
      change: stats?.publishedChange
        ? `${stats.publishedChange > 0 ? "+" : ""}${stats.publishedChange}%`
        : "+0%",
      icon: CheckCircle2,
      trend:
        stats?.publishedChange && stats.publishedChange > 0
          ? ("up" as const)
          : ("down" as const),
    },
    {
      title: text.stats.connectedAccounts,
      value: accounts.length.toString(),
      change: stats?.accountsChange ? `+${stats.accountsChange}` : "+0",
      icon: Users,
      trend: "up" as const,
    },
    {
      title: text.stats.avgEngagement,
      value: stats?.avgEngagement ? `${stats.avgEngagement.toFixed(1)}%` : "0%",
      change: stats?.engagementChange
        ? `${stats.engagementChange > 0 ? "+" : ""}${stats.engagementChange.toFixed(1)}%`
        : "+0%",
      icon: TrendingUp,
      trend:
        stats?.engagementChange && stats.engagementChange > 0
          ? ("up" as const)
          : ("down" as const),
    },
  ];

  const recentActivity = recentPosts.slice(0, 4).map((post, index) => ({
    id: post.id,
    type:
      post.status === "published"
        ? "published"
        : post.status === "scheduled"
          ? "scheduled"
          : "failed",
    platform: post.targets?.[0]?.provider ?? "unknown",
    content: post.contentEn || post.contentAr || "No content",
    time: getTimeAgo(post.createdAt),
    status:
      post.status === "published"
        ? ("success" as const)
        : post.status === "scheduled"
          ? ("pending" as const)
          : ("error" as const),
  }));

  const connectedPlatforms = [
    {
      name: "Twitter",
      icon: Twitter,
      connected: accounts.some((a) => a.provider === "x"),
      color: "text-blue-400",
      provider: "x",
    },
    {
      name: "Instagram",
      icon: Instagram,
      connected: accounts.some((a) => a.provider === "instagram"),
      color: "text-pink-400",
      provider: "instagram",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      connected: accounts.some((a) => a.provider === "linkedin"),
      color: "text-blue-600",
      provider: "linkedin",
    },
    {
      name: "TikTok",
      icon: Music2,
      connected: accounts.some((a) => a.provider === "tiktok"),
      color: "text-gray-400",
      provider: "tiktok",
    },
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "x":
      case "twitter":
        return <Twitter className="size-4" />;
      case "instagram":
        return <Instagram className="size-4" />;
      case "linkedin":
        return <Linkedin className="size-4" />;
      case "tiktok":
        return <Music2 className="size-4" />;
      default:
        return <FileText className="size-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-primary ">
            {text.activityStatus.published}
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-gold-500/20 dark:bg-gold-500/80 text-gold-400"
          >
            {text.activityStatus.scheduled}
          </Badge>
        );
      case "scheduled":
        return (
          <Badge
            variant="secondary"
            className="bg-amber-500/20 dark:bg-amber-500/80 text-gold-400"
          >
            {text.activityStatus.scheduled}
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive" className="bg-red-500">
            {text.activityStatus.failed}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div
        ref={statsRef}
        className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {dashboardStats.map((stat, index) => (
          <Card key={index} className="stat-card border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="mt-2 font-bold text-3xl text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-primary">
                    {stat.change} {text.stats.changeFromLastWeek}
                  </p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/20">
                  <stat.icon className="size-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">
              {text.recentActivity.title}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {text.recentActivity.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div ref={activityRef} className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="activity-item flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted"
                  >
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                      {getPlatformIcon(activity.platform)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm text-foreground line-clamp-2">
                          {activity.content}
                        </p>
                        {getStatusBadge(activity.status)}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No recent activity yet
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              className="mt-4 w-full text-primary hover:bg-primary/10 hover:text-primary"
              asChild
            >
              <Link href="/dashboard/platforms">
                {text.recentActivity.viewAll}
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions & Connected Platforms */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">
                {text.quickActions.title}
              </CardTitle>
            </CardHeader>
            <CardContent ref={quickActionsRef} className="space-y-3">
              <Button
                className="quick-action w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link href="/dashboard/create">
                  <Plus className="mr-2 size-4" />
                  {text.quickActions.createPost}
                </Link>
              </Button>
              <Button
                variant="outline"
                className="quick-action w-full justify-start border-border bg-card text-foreground hover:bg-muted"
                asChild
              >
                <Link href="/dashboard/calendar">
                  <Calendar className="mr-2 size-4" />
                  {text.quickActions.viewCalendar}
                </Link>
              </Button>
              <Button
                variant="outline"
                className="quick-action w-full justify-start border-border bg-card text-foreground hover:bg-muted"
                asChild
              >
                <Link href="/dashboard/analytics">
                  <BarChart3 className="mr-2 size-4" />
                  {text.quickActions.viewAnalytics}
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Connected Platforms */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">
                {text.connectedPlatforms.title}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {text.connectedPlatforms.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {connectedPlatforms.map((platform) => (
                <div
                  key={platform.name}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                      <platform.icon className="size-4 text-foreground" />
                    </div>
                    <span className="text-sm text-foreground">
                      {platform.name}
                    </span>
                  </div>
                  {platform.connected ? (
                    <Badge
                      variant="default"
                      className="bg-primary/20 text-primary"
                    >
                      {text.connectedPlatforms.connected}
                    </Badge>
                  ) : (
                    <Button size="sm" variant="ghost">
                      {text.connectedPlatforms.connect}
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="ghost"
                className="w-full text-primary hover:bg-primary/10 hover:text-primary"
                asChild
              >
                <Link href="/dashboard/platforms">
                  <Plus className="mr-2 size-4" />
                  {text.connectedPlatforms.addPlatform}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
}
