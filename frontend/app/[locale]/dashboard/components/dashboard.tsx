"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserResponseDto } from "@/api/model";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

// Define the text interface
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
  user: UserResponseDto | null;
}

export default function DashboardPage({ text, locale, user }: DashboardPageProps) {
  const statsRef = useRef<HTMLDivElement>(null);
  const activityRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter()
  useEffect(() => {
    if (!user) {
      router.replace(`/login`);
    }
  }, [])
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".stat-card", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      });

      gsap.from(".activity-item", {
        opacity: 0,
        x: -20,
        duration: 0.5,
        stagger: 0.08,
        delay: 0.3,
        ease: "power2.out",
      });
    });
    return () => ctx.revert();
  }, []);

  // Stats data — only labels are translated
  const stats = [
    {
      title: text.stats.scheduledPosts,
      value: "24",
      change: "+12%",
      icon: Clock,
      trend: "up",
    },
    {
      title: text.stats.publishedThisWeek,
      value: "18",
      change: "+8%",
      icon: CheckCircle2,
      trend: "up",
    },
    {
      title: text.stats.connectedAccounts,
      value: "4",
      change: "+1",
      icon: Users,
      trend: "up",
    },
    {
      title: text.stats.avgEngagement,
      value: "3.2%",
      change: "+0.5%",
      icon: TrendingUp,
      trend: "up",
    },
  ];

  // Recent activity items — content is dynamic, but status labels are translated
  const recentActivity = [
    {
      id: 1,
      type: "published",
      platform: "twitter",
      content: "New product launch announcement in Arabic",
      time: "2 hours ago",
      status: "success" as const,
    },
    {
      id: 2,
      type: "scheduled",
      platform: "instagram",
      content: "Behind the scenes content for tomorrow",
      time: "4 hours ago",
      status: "pending" as const,
    },
    {
      id: 3,
      type: "published",
      platform: "linkedin",
      content: "Industry insights and market analysis",
      time: "6 hours ago",
      status: "success" as const,
    },
    {
      id: 4,
      type: "failed",
      platform: "tiktok",
      content: "Video content upload failed",
      time: "8 hours ago",
      status: "error" as const,
    },
  ];

  const connectedPlatforms = [
    { name: "Twitter", icon: Twitter, connected: true, color: "text-blue-400" },
    { name: "Instagram", icon: Instagram, connected: true, color: "text-pink-400" },
    { name: "LinkedIn", icon: Linkedin, connected: true, color: "text-blue-600" },
    { name: "TikTok", icon: Music2, connected: true, color: "text-gray-400" },
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitter": return <Twitter className="size-4" />;
      case "instagram": return <Instagram className="size-4" />;
      case "linkedin": return <Linkedin className="size-4" />;
      case "tiktok": return <Music2 className="size-4" />;
      default: return <FileText className="size-4" />;
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
          <Badge variant="secondary" className="bg-gold-500/20 dark:bg-gold-500/80 text-gold-400">
            {text.activityStatus.scheduled}
          </Badge>
        );
      case "scheduled":
        return (
          <Badge variant="secondary" className="bg-amber-500/20 dark:bg-amber-500/80 text-gold-400">
            {text.activityStatus.scheduled}
          </Badge>
        )
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

      < div ref={statsRef} className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" >
        {
          stats.map((stat, index) => (
            < Card key={index} className="stat-card border-border bg-card" >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="mt-2 font-bold text-3xl text-foreground">{stat.value}</p>
                    <p className="mt-1 text-sm text-primary">{stat.change} {text.stats.changeFromLastWeek}</p>
                  </div>
                  <div className="flex size-12 items-center justify-center rounded-lg bg-primary/20">
                    <stat.icon className="size-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        }
      </div >

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">{text.recentActivity.title}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {text.recentActivity.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div ref={activityRef} className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="activity-item flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    {getPlatformIcon(activity.platform)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm text-foreground">{activity.content}</p>
                      {getStatusBadge(activity.status)}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="mt-4 w-full text-primary hover:bg-primary/10 hover:text-primary"
              asChild
            >
              <Link href="/dashboard/activity">
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
              <CardTitle className="text-foreground">{text.quickActions.title}</CardTitle>
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
              <CardTitle className="text-foreground">{text.connectedPlatforms.title}</CardTitle>
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
                    <span className="text-sm text-foreground">{platform.name}</span>
                  </div>
                  {platform.connected ? (
                    <Badge variant="default" className="bg-primary/20 text-primary">
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
