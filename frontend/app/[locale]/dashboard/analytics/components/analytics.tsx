"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
  Activity,
  Zap,
  CheckCircle,
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
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { toast } from "sonner";
import type {
  IAnalytics,
  IEngagementData,
  IPlatformPerformance,
} from "@/lib/analytics-helper";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
  const locale = text.locale || "en";
  const [timeRange, setTimeRange] = useState("week");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [animateItems, setAnimateItems] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState<number | null>(null);

  const statsRef = useRef<HTMLDivElement>(null);
  const chartsRef = useRef<HTMLDivElement>(null);
  const postsRef = useRef<HTMLDivElement>(null);

  // Trigger animations after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateItems(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleTimeRangeChange = (value: string) => {
    setIsLoading(true);
    setLoadingProgress(0);

    toast.loading("Loading analytics data...", {
      id: "load-analytics",
    });

    // Simulate progress
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev === null) return 20;
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    // Simulate API call
    setTimeout(() => {
      clearInterval(progressInterval);
      setLoadingProgress(100);
      setTimeRange(value);
      setIsLoading(false);

      toast.success("Analytics data loaded successfully", {
        id: "load-analytics",
        icon: <CheckCircle className="h-4 w-4" />,
        duration: 2000,
      });

      // Reset progress after a delay
      setTimeout(() => {
        setLoadingProgress(null);
      }, 1000);
    }, 1500);
  };

  const handleExportData = () => {
    toast.loading("Preparing export...", {
      id: "export-data",
    });

    // Simulate export process
    setTimeout(() => {
      toast.success("Analytics data exported successfully", {
        id: "export-data",
        icon: <CheckCircle className="h-4 w-4" />,
        duration: 2000,
      });
    }, 1500);
  };

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
      color: "from-pink-500 to-rose-500",
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
      color: "from-blue-500 to-cyan-500",
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
      color: "from-green-500 to-emerald-500",
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
      color: "from-amber-500 to-orange-500",
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

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "x":
      case "twitter":
        return "#1DA1F2";
      case "instagram":
        return "#E4405F";
      case "linkedin":
        return "#0077B5";
      case "tiktok":
        return "#000000";
      default:
        return "#888888";
    }
  };

  return (
    <>
      {loadingProgress !== null && (
        <div className="fixed top-4 right-4 z-50 w-80 bg-background border rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Loading analytics...</span>
            <span className="text-sm text-muted-foreground">
              {loadingProgress}%
            </span>
          </div>
          <Progress
            value={loadingProgress}
            className="h-2"
            dir={locale === "ar" ? "rtl" : "ltr"}
          />
        </div>
      )}

      <div className="flex flex-col min-h-screen bg-background">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
          {/* Header */}
          <div
            ref={statsRef}
            className={cn(
              "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-500",
              animateItems
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4",
            )}
          >
            <div>
              <h1 className="font-bold text-3xl text-foreground">
                {text.title}
              </h1>
              <p className="mt-1 text-muted-foreground">{text.subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <SidebarTrigger className="lg:hidden" />
              <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                <SelectTrigger className="w-[180px] transition-all duration-300 hover:ring-2 hover:ring-primary/20">
                  <SelectValue placeholder={text.timeRangeLabel} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">
                    {text.timeRanges["week"]}
                  </SelectItem>
                  <SelectItem value="month">
                    {text.timeRanges["month"]}
                  </SelectItem>
                  <SelectItem value="quarter">
                    {text.timeRanges["quarter"]}
                  </SelectItem>
                  <SelectItem value="year">
                    {text.timeRanges["year"]}
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleExportData}
                className="transition-all duration-300 hover:scale-105"
              >
                <Activity className="mr-2 size-4" />
                {text.export || "Export"}
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className={cn(
                  "border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group",
                  animateItems
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4",
                )}
                style={{ animationDelay: `${100 + index * 100}ms` }}
              >
                <div className={`h-1 bg-gradient-to-r ${stat.color}`}></div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="mt-2 font-bold text-2xl sm:text-3xl text-foreground transition-all duration-300 group-hover:scale-105">
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
                    <div className="ml-4 flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 transition-all duration-300 group-hover:scale-110">
                      <stat.icon className="size-6 text-primary" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress
                      value={
                        Math.abs(
                          Number.parseFloat(
                            stat.change.replace(/[^0-9.-]/g, ""),
                          ),
                        ) * 10
                      }
                      className="h-2"
                      dir={locale === "ar" ? "rtl" : "ltr"}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div
            ref={chartsRef}
            className={cn(
              "grid gap-6 lg:grid-cols-2 transition-all duration-500",
              animateItems
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4",
            )}
            style={{ animationDelay: "500ms" }}
          >
            {/* Engagement Over Time */}
            <Card className="border-border bg-card transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="size-5 text-primary" />
                  {text.charts.engagementOverTime}
                </CardTitle>
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
                    {text.charts.noData || "No data available"}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Platform Performance */}
            <Card className="border-border bg-card transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="size-5 text-primary" />
                  {text.charts.platformPerformance}
                </CardTitle>
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
                          radius={[8, 8, 0, 0]}
                        >
                          {chartPlatformData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={getPlatformColor(entry.platform)}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    {text.charts.noData || "No data available"}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Platform Details & Top Posts */}
          <div
            ref={postsRef}
            className={cn(
              "grid gap-6 lg:grid-cols-3 transition-all duration-500",
              animateItems
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4",
            )}
            style={{ animationDelay: "700ms" }}
          >
            {/* Platform Details */}
            <Card className="border-border bg-card transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="size-5 text-primary" />
                  {text.platformBreakdown.title}
                </CardTitle>
                <CardDescription>
                  {text.platformBreakdown.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {chartPlatformData.length > 0 ? (
                  chartPlatformData.map((item, index) => (
                    <div
                      key={item.platform}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-all duration-300 hover:scale-[1.02]",
                        animateItems
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-4",
                      )}
                      style={{ animationDelay: `${900 + index * 100}ms` }}
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
                        <p className="font-semibold">
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
            <Card className="border-border bg-card lg:col-span-2 transition-all duration-300 hover:shadow-md">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="size-5 text-primary" />
                    {text.topPosts.title}
                  </CardTitle>
                  <CardDescription>{text.topPosts.description}</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportData}
                  className="transition-all duration-300 hover:scale-105 bg-transparent"
                >
                  <Activity className="mr-2 size-3" />
                  {text.export || "Export"}
                </Button>
              </CardHeader>
              <CardContent>
                {displayTopPosts.length > 0 ? (
                  <div className="space-y-4">
                    {displayTopPosts.map((post: any, index) => (
                      <div
                        key={post.id}
                        className={cn(
                          "flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-all duration-300 hover:scale-[1.01] group",
                          animateItems
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4",
                        )}
                        style={{ animationDelay: `${900 + index * 50}ms` }}
                      >
                        <div className="flex size-10 items-center justify-center rounded-lg bg-muted shrink-0">
                          {getPlatformIcon(post.platform)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm mb-2 line-clamp-2 transition-colors group-hover:text-foreground">
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
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="size-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {text.topPosts.noData || "No top posts available"}
                    </h3>
                    <p className="text-muted-foreground">
                      {text.topPosts.noDataDescription ||
                        "Start creating content to see it here"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
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
