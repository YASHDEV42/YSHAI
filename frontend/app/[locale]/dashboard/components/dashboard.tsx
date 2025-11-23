"use client";

import { useRef, useEffect, useState } from "react";
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
import { StatCard } from "@/components/ui/stat-card";
import type { IDashboardStats } from "@/lib/analytics-helper";
import type { ISocialAccount, IPost } from "@/interfaces";

interface DashboardPageProps {
  text: any;
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
  const [isVisible, setIsVisible] = useState({
    stats: false,
    activity: false,
    quickActions: false,
  });
  const [animatedValues, setAnimatedValues] = useState({
    scheduledPosts: 0,
    publishedThisWeek: 0,
    connectedAccounts: 0,
    avgEngagement: 0,
  });

  const isRTL = locale === "ar";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 },
    );

    if (statsRef.current) observer.observe(statsRef.current);
    if (activityRef.current) observer.observe(activityRef.current);
    if (quickActionsRef.current) observer.observe(quickActionsRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible.stats) {
      const targetValues = {
        scheduledPosts: stats?.scheduledPosts || 0,
        publishedThisWeek: stats?.publishedThisWeek || 0,
        connectedAccounts: accounts.length,
        avgEngagement: stats?.avgEngagement || 0,
      };

      const duration = 1500;
      const steps = 60;
      const increment = {
        scheduledPosts: targetValues.scheduledPosts / steps,
        publishedThisWeek: targetValues.publishedThisWeek / steps,
        connectedAccounts: targetValues.connectedAccounts / steps,
        avgEngagement: targetValues.avgEngagement / steps,
      };

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        setAnimatedValues({
          scheduledPosts: Math.min(
            Math.floor(increment.scheduledPosts * currentStep),
            targetValues.scheduledPosts,
          ),
          publishedThisWeek: Math.min(
            Math.floor(increment.publishedThisWeek * currentStep),
            targetValues.publishedThisWeek,
          ),
          connectedAccounts: Math.min(
            Math.floor(increment.connectedAccounts * currentStep),
            targetValues.connectedAccounts,
          ),
          avgEngagement: Math.min(
            increment.avgEngagement * currentStep,
            targetValues.avgEngagement,
          ),
        });

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isVisible.stats, stats, accounts]);

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
          <Badge variant="default" className="bg-primary animate-pulse-once">
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
          <Badge
            variant="destructive"
            className="bg-red-500 animate-pulse-once"
          >
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
        id="stats"
        className={`mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 transition-all duration-1000 ease-out ${
          isVisible.stats
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        }`}
      >
        <StatCard
          title={text.stats.scheduledPosts}
          value={animatedValues.scheduledPosts.toString()}
          description={`${stats?.scheduledChange ? `${stats.scheduledChange > 0 ? "+" : ""}${stats.scheduledChange}%` : "+0%"} ${text.stats.changeFromLastWeek}`}
          icon={Clock}
          progressValue={Math.min(
            (animatedValues.scheduledPosts / 10) * 100,
            100,
          )}
          animate={isVisible.stats}
          animationDelay="0ms"
          locale={locale}
        />
        <StatCard
          title={text.stats.publishedThisWeek}
          value={animatedValues.publishedThisWeek.toString()}
          description={`${stats?.publishedChange ? `${stats.publishedChange > 0 ? "+" : ""}${stats.publishedChange}%` : "+0%"} ${text.stats.changeFromLastWeek}`}
          icon={CheckCircle2}
          progressValue={Math.min(
            (animatedValues.publishedThisWeek / 10) * 100,
            100,
          )}
          animate={isVisible.stats}
          animationDelay="100ms"
          locale={locale}
        />
        <StatCard
          title={text.stats.connectedAccounts}
          value={animatedValues.connectedAccounts.toString()}
          description={`${stats?.accountsChange ? `+${stats.accountsChange}` : "+0"} ${text.stats.changeFromLastWeek}`}
          icon={Users}
          progressValue={Math.min(
            (animatedValues.connectedAccounts / 10) * 100,
            100,
          )}
          animate={isVisible.stats}
          animationDelay="200ms"
          locale={locale}
        />
        <StatCard
          title={text.stats.avgEngagement}
          value={
            animatedValues.avgEngagement
              ? `${animatedValues.avgEngagement.toFixed(1)}%`
              : "0%"
          }
          description={`${stats?.engagementChange ? `${stats.engagementChange > 0 ? "+" : ""}${stats.engagementChange.toFixed(1)}%` : "+0%"} ${text.stats.changeFromLastWeek}`}
          icon={TrendingUp}
          progressValue={animatedValues.avgEngagement}
          animate={isVisible.stats}
          animationDelay="300ms"
          locale={locale}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="border-border bg-card lg:col-span-2 transition-all duration-500 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              {text.recentActivity.title}
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {text.recentActivity.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div ref={activityRef} id="activity" className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="activity-item flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-all duration-100 hover:bg-muted hover:scale-[1.02] hover:shadow-md"
                    style={{
                      animationDelay: `${index * 150}ms`,
                      animation: isVisible.activity
                        ? "slideInLeft 0.5s ease-out forwards"
                        : "none",
                      opacity: isVisible.activity ? 1 : 0,
                      transform: isVisible.activity
                        ? "translateX(0)"
                        : "translateX(-20px)",
                    }}
                  >
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted transition-all duration-100 hover:scale-110 hover:rotate-6">
                      {getPlatformIcon(activity.platform)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm text-foreground line-clamp-2 transition-all duration-100 hover:text-primary">
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
                <p className="text-center text-sm text-muted-foreground py-8 animate-pulse">
                  No recent activity yet
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              className="mt-4 w-full text-primary hover:bg-primary/10 hover:text-primary transition-all duration-100 hover:scale-105"
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
          <Card className="border-border bg-card transition-all duration-500 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground">
                {text.quickActions.title}
              </CardTitle>
            </CardHeader>
            <CardContent
              ref={quickActionsRef}
              id="quickActions"
              className="space-y-3"
            >
              {[
                {
                  href: "/dashboard/create",
                  icon: Plus,
                  text: text.quickActions.createPost,
                },
                {
                  href: "/dashboard/calendar",
                  icon: Calendar,
                  text: text.quickActions.viewCalendar,
                },
                {
                  href: "/dashboard/analytics",
                  icon: BarChart3,
                  text: text.quickActions.viewAnalytics,
                },
              ].map((action, index) => (
                <Button
                  key={index}
                  className="quick-action w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-100 hover:scale-105 hover:shadow-md hover:-translate-y-1 group"
                  asChild
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: isVisible.quickActions
                      ? "slideInRight 0.5s ease-out forwards"
                      : "none",
                    opacity: isVisible.quickActions ? 1 : 0,
                    transform: isVisible.quickActions
                      ? "translateX(0)"
                      : "translateX(20px)",
                  }}
                >
                  <Link href={action.href}>
                    <action.icon className="mr-2 size-4 transition-transform duration-100 group-hover:rotate-12" />
                    {action.text}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Connected Platforms */}
          <Card className="border-border bg-card transition-all duration-500 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground">
                {text.connectedPlatforms.title}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {text.connectedPlatforms.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {connectedPlatforms.map((platform, index) => (
                <div
                  key={platform.name}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-3 transition-all duration-100 hover:scale-105 hover:shadow-md hover:-translate-y-1"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeIn 0.5s ease-out forwards",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-muted transition-all duration-100 hover:scale-110 hover:rotate-12">
                      <platform.icon
                        className={`size-4 text-foreground ${platform.color}`}
                      />
                    </div>
                    <span className="text-sm text-foreground">
                      {platform.name}
                    </span>
                  </div>
                  {platform.connected ? (
                    <Badge
                      variant="default"
                      className="bg-primary/20 text-primary transition-all duration-100 hover:scale-110"
                    >
                      {text.connectedPlatforms.connected}
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="transition-all duration-100 hover:scale-110 hover:bg-primary/10"
                    >
                      {text.connectedPlatforms.connect}
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="ghost"
                className="w-full text-primary hover:bg-primary/10 hover:text-primary transition-all duration-100 hover:scale-105"
                asChild
              >
                <Link href="/dashboard/platforms">
                  <Plus className="mr-2 size-4 transition-transform duration-100 hover:rotate-90" />
                  {text.connectedPlatforms.addPlatform}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse-once {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) 1;
        }
      `}</style>
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
