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

export default function AnalyticsClient({ text }: { text: any }) {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  // Mock data — in real app, this would come from API
  const engagementData = [
    { date: "Mon", likes: 245, comments: 89, shares: 34, views: 1240 },
    { date: "Tue", likes: 312, comments: 102, shares: 45, views: 1580 },
    { date: "Wed", likes: 289, comments: 95, shares: 38, views: 1420 },
    { date: "Thu", likes: 401, comments: 134, shares: 67, views: 1890 },
    { date: "Fri", likes: 378, comments: 121, shares: 56, views: 1750 },
    { date: "Sat", likes: 456, comments: 156, shares: 78, views: 2100 },
    { date: "Sun", likes: 423, comments: 142, shares: 71, views: 1980 },
  ];

  const platformData = [
    { platform: "twitter", posts: 24, engagement: 3420, growth: 12.5 },
    { platform: "instagram", posts: 18, engagement: 5680, growth: 18.3 },
    { platform: "linkedin", posts: 12, engagement: 2340, growth: 8.7 },
    { platform: "tiktok", posts: 15, engagement: 8920, growth: 24.1 },
  ];

  const topPosts = [
    {
      id: 1,
      platform: "instagram",
      content: "Behind the scenes of our latest project",
      likes: 1234,
      comments: 89,
      shares: 45,
      date: "2 days ago",
    },
    {
      id: 2,
      platform: "twitter",
      content: "Exciting product launch announcement!",
      likes: 892,
      comments: 67,
      shares: 123,
      date: "3 days ago",
    },
    {
      id: 3,
      platform: "linkedin",
      content: "Industry insights and market trends",
      likes: 567,
      comments: 34,
      shares: 78,
      date: "5 days ago",
    },
    {
      id: 4,
      platform: "tiktok",
      content: "Fun video content for our audience",
      likes: 2341,
      comments: 156,
      shares: 234,
      date: "1 week ago",
    },
  ];

  const stats = [
    {
      title: text.stats.totalEngagement,
      value: "24.5K",
      change: "+12.5%",
      trend: "up" as const,
      icon: Heart,
    },
    {
      title: text.stats.totalReach,
      value: "156.2K",
      change: "+18.3%",
      trend: "up" as const,
      icon: Eye,
    },
    {
      title: text.stats.newFollowers,
      value: "2,341",
      change: "+8.7%",
      trend: "up" as const,
      icon: Users,
    },
    {
      title: text.stats.avgEngagementRate,
      value: "4.2%",
      change: "-0.3%",
      trend: "down" as const,
      icon: TrendingUp,
    },
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
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
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
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
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="mt-2 font-bold text-3xl text-foreground">
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
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/20">
                  <stat.icon className="size-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Engagement Over Time */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>{text.charts.engagementOverTime}</CardTitle>
            <CardDescription>
              {text.charts.engagementOverTimeDesc}
            </CardDescription>
          </CardHeader>
          <CardContent>
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
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="likes"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="comments"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="shares"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
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
          <CardContent>
            <ChartContainer
              config={{
                engagement: {
                  label: text.metrics.engagement,
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="platform"
                    tickFormatter={(value) =>
                      getPlatformName(value.toLowerCase())
                    }
                    className="text-xs"
                  />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="engagement"
                    fill="hsl(var(--chart-1))"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
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
            {platformData.map((item) => (
              <div
                key={item.platform}
                className="flex items-center justify-between p-3 rounded-lg border border-border"
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
                    <p className="text-xs text-green-500">+{item.growth}%</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Posts */}
        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle>{text.topPosts.title}</CardTitle>
            <CardDescription>{text.topPosts.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted shrink-0">
                  {getPlatformIcon(post.platform)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm mb-2">{post.content}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="size-3" />
                      <span>{post.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="size-3" />
                      <span>{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="size-3" />
                      <span>{post.shares}</span>
                    </div>
                    <span className="ml-auto">{post.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
