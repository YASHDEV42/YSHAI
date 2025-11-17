"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Twitter,
  Instagram,
  Linkedin,
  Music2,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type {
  IAnalytics,
  IEngagementData,
  IPlatformPerformance,
} from "@/lib/analytics-helper";

interface AnalyticsClientProps {
  text: any;
  analytics?: IAnalytics;
  engagementData?: IEngagementData[];
  platformData?: IPlatformPerformance[];
  topPosts?: any[];
}

export default function AnalyticsClient({
  text,
  analytics,
  engagementData,
  platformData,
  topPosts,
}: AnalyticsClientProps) {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  const stats = [
    {
      title: text.stats.totalEngagement,
      value: analytics?.totalEngagement
        ? formatNumber(analytics.totalEngagement)
        : "0",
      change: analytics?.engagementChange
        ? `${analytics.engagementChange > 0 ? "+" : ""}${analytics.engagementChange.toFixed(1)}%`
        : "+0%",
      trend:
        (analytics?.engagementChange ?? 0) >= 0
          ? ("up" as const)
          : ("down" as const),
      icon: Heart,
    },
    {
      title: text.stats.totalReach,
      value: analytics?.totalReach ? formatNumber(analytics.totalReach) : "0",
      change: analytics?.reachChange
        ? `${analytics.reachChange > 0 ? "+" : ""}${analytics.reachChange.toFixed(1)}%`
        : "+0%",
      trend:
        (analytics?.reachChange ?? 0) >= 0
          ? ("up" as const)
          : ("down" as const),
      icon: Eye,
    },
    {
      title: text.stats.newFollowers,
      value: analytics?.newFollowers
        ? formatNumber(analytics.newFollowers)
        : "0",
      change: analytics?.followersChange
        ? `${analytics.followersChange > 0 ? "+" : ""}${analytics.followersChange.toFixed(1)}%`
        : "+0%",
      trend:
        (analytics?.followersChange ?? 0) >= 0
          ? ("up" as const)
          : ("down" as const),
      icon: Users,
    },
    {
      title: text.stats.avgEngagementRate,
      value: analytics?.avgEngagementRate
        ? `${analytics.avgEngagementRate.toFixed(1)}%`
        : "0%",
      change: analytics?.engagementRateChange
        ? `${analytics.engagementRateChange > 0 ? "+" : ""}${analytics.engagementRateChange.toFixed(1)}%`
        : "+0%",
      trend:
        (analytics?.engagementRateChange ?? 0) >= 0
          ? ("up" as const)
          : ("down" as const),
      icon: TrendingUp,
    },
  ];

  const chartEngagementData = engagementData ?? [
    { date: "Mon", likes: 0, comments: 0, shares: 0, views: 0 },
  ];

  const chartPlatformData = platformData ?? [];

  const displayTopPosts = topPosts ?? [];

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
        return null;
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case "x":
      case "twitter":
        return text.platforms.twitter;
      case "instagram":
        return text.platforms.instagram;
      case "linkedin":
        return text.platforms.linkedin;
      case "tiktok":
        return text.platforms.tiktok;
      default:
        return platform;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-bold text-3xl text-foreground">{text.title}</h1>
            <p className="mt-1 text-muted-foreground">{text.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <SidebarTrigger className="lg:hidden" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={text.timeRangeLabel} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">{text.timeRanges["7d"]}</SelectItem>
                <SelectItem value="30d">{text.timeRanges["30d"]}</SelectItem>
                <SelectItem value="90d">{text.timeRanges["90d"]}</SelectItem>
                <SelectItem value="1y">{text.timeRanges["1y"]}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="mt-2 font-bold text-2xl sm:text-3xl text-foreground">
                      {stat.value}
                    </p>
                    <div className="mt-1 flex items-center gap-1">
                      {stat.trend === "up" ? (
                        <TrendingUp className="size-4 text-green-500" />
                      ) : (
                        <TrendingDown className="size-4 text-red-500" />
                      )}
                      <p
                        className={`text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}
                      >
                        {stat.change}
                      </p>
                    </div>
                  </div>
                  <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                    <stat.icon className="size-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Engagement Over Time */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>{text.charts.engagementOverTime}</CardTitle>
              <CardDescription>
                {text.charts.engagementOverTimeDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              {chartEngagementData.length > 0 ? (
                <ChartContainer
                  config={{
                    likes: {
                      label: text.metrics.likes,
                      color: "hsl(var(--chart-1))",
                    },
                    comments: {
                      label: text.metrics.comments,
                      color: "hsl(var(--chart-2))",
                    },
                    shares: {
                      label: text.metrics.shares,
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="w-full h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartEngagementData}
                      margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                        strokeOpacity={0.3}
                      />
                      <XAxis
                        dataKey="date"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend
                        wrapperStyle={{ paddingTop: "20px" }}
                        iconType="line"
                      />
                      <Line
                        type="monotone"
                        dataKey="likes"
                        name={text.metrics.likes}
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                        dot={{
                          fill: "hsl(var(--chart-1))",
                          strokeWidth: 2,
                          r: 4,
                        }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="comments"
                        name={text.metrics.comments}
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={2}
                        dot={{
                          fill: "hsl(var(--chart-2))",
                          strokeWidth: 2,
                          r: 4,
                        }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="shares"
                        name={text.metrics.shares}
                        stroke="hsl(var(--chart-3))"
                        strokeWidth={2}
                        dot={{
                          fill: "hsl(var(--chart-3))",
                          strokeWidth: 2,
                          r: 4,
                        }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  {text.charts.noData || "No engagement data available"}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Platform Performance */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>{text.charts.platformPerformance}</CardTitle>
              <CardDescription>
                {text.charts.platformPerformanceDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              {chartPlatformData.length > 0 ? (
                <ChartContainer
                  config={{
                    engagement: {
                      label: text.metrics.engagement,
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="w-full h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartPlatformData}
                      margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                        strokeOpacity={0.3}
                      />
                      <XAxis
                        dataKey="platform"
                        tickFormatter={(value) =>
                          getPlatformName(value.toLowerCase())
                        }
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="engagement"
                        name={text.metrics.engagement}
                        fill="hsl(var(--chart-1))"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  {text.charts.noData || "No platform data available"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Platform Details & Top Posts */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Platform Details */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>{text.platformBreakdown.title}</CardTitle>
              <CardDescription>
                {text.platformBreakdown.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {chartPlatformData.length > 0 ? (
                chartPlatformData.map((item) => (
                  <div
                    key={item.platform}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                        {getPlatformIcon(item.platform.toLowerCase())}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {getPlatformName(item.platform.toLowerCase())}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.posts} {text.platformBreakdown.posts}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">
                        {item.engagement.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="size-3 text-green-500" />
                        <p className="text-xs text-green-500">
                          +{item.growth.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground py-8">
                  {text.platformBreakdown.noData ||
                    "No platform data available"}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Top Posts */}
          <Card className="border-border bg-card lg:col-span-2">
            <CardHeader>
              <CardTitle>{text.topPosts.title}</CardTitle>
              <CardDescription>{text.topPosts.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {displayTopPosts.length > 0 ? (
                displayTopPosts.map((post: any) => (
                  <div
                    key={post.id}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted shrink-0">
                      {getPlatformIcon(post.platform)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm mb-2 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1">
                          <Heart className="size-3" />
                          <span>{(post.likes ?? 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="size-3" />
                          <span>{post.comments ?? 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Share2 className="size-3" />
                          <span>{post.shares ?? 0}</span>
                        </div>
                        <span className="ml-auto">{post.date}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground py-8">
                  {text.topPosts.noData || "No top posts available"}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}
