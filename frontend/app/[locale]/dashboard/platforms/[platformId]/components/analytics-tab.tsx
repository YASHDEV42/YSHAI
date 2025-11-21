"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Eye,
  Users,
  Activity,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Line,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

interface AnalyticsTabProps {
  text: any;
  locale: string;
  posts: any[];
  animateItems?: boolean;
}

export function AnalyticsTab({
  text,
  locale,
  posts,
  animateItems = false,
}: AnalyticsTabProps) {
  const calculateEngagementData = () => {
    const monthlyData: Record<
      string,
      { likes: number; comments: number; shares: number; posts: number }
    > = {};

    posts.forEach((post) => {
      const date = new Date(post.timestamp);
      const monthKey = date.toLocaleDateString(locale, {
        month: "short",
        year: "2-digit",
      });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { likes: 0, comments: 0, shares: 0, posts: 0 };
      }

      monthlyData[monthKey].likes += post.likeCount || 0;
      monthlyData[monthKey].comments += post.commentsCount || 0;
      monthlyData[monthKey].shares += post.shareCount || 0;
      monthlyData[monthKey].posts += 1;
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      likes: data.likes,
      comments: data.comments,
      shares: data.shares,
      avgEngagement:
        data.posts > 0
          ? Math.round((data.likes + data.comments + data.shares) / data.posts)
          : 0,
    }));
  };

  const engagementChartData = calculateEngagementData();

  const calculateAnalytics = () => {
    if (posts.length === 0) {
      return {
        avgLikes: 0,
        avgComments: 0,
        avgShares: 0,
        avgEngagement: 0,
        bestTime: "N/A",
        totalReach: 0,
      };
    }

    const totalLikes = posts.reduce(
      (sum, post) => sum + (post.likeCount || 0),
      0,
    );
    const totalComments = posts.reduce(
      (sum, post) => sum + (post.commentsCount || 0),
      0,
    );
    const totalShares = posts.reduce(
      (sum, post) => sum + (post.shareCount || 0),
      0,
    );
    const totalReach = posts.reduce(
      (sum, post) => sum + (post.reachCount || 0),
      0,
    );

    const hourCounts: Record<number, number> = {};
    posts.forEach((post) => {
      const hour = new Date(post.timestamp).getHours();
      hourCounts[hour] =
        (hourCounts[hour] || 0) +
        (post.likeCount || 0) +
        (post.commentsCount || 0);
    });

    const bestHour =
      Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "14";
    const bestTime = `${bestHour}:00`;

    return {
      avgLikes: Math.round(totalLikes / posts.length),
      avgComments: Math.round(totalComments / posts.length),
      avgShares: Math.round(totalShares / posts.length),
      avgEngagement: Math.round(
        (totalLikes + totalComments + totalShares) / posts.length,
      ),
      bestTime,
      totalReach,
    };
  };

  const analytics = calculateAnalytics();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={text.analytics?.avgLikes || "Average Likes"}
          value={analytics.avgLikes.toLocaleString()}
          description={text.stats?.posts || "per post"}
          icon={Heart}
          progressValue={Math.min(analytics.avgLikes * 2, 100)}
          animate={animateItems}
          animationDelay="100ms"
          locale={locale}
        />
        <StatCard
          title={text.analytics?.avgComments || "Average Comments"}
          value={analytics.avgComments.toLocaleString()}
          description={text.stats?.posts || "per post"}
          icon={MessageCircle}
          progressValue={Math.min(analytics.avgComments * 5, 100)}
          animate={animateItems}
          animationDelay="200ms"
          locale={locale}
        />
        <StatCard
          title={text.analytics?.avgShares || "Average Shares"}
          value={analytics.avgShares.toLocaleString()}
          description={text.stats?.posts || "per post"}
          icon={Share2}
          progressValue={Math.min(analytics.avgShares * 10, 100)}
          animate={animateItems}
          animationDelay="300ms"
          locale={locale}
        />
        <StatCard
          title={text.analytics?.bestPostTime || "Best Time to Post"}
          value={analytics.bestTime}
          description={text.analytics?.bestPostTime || "peak engagement"}
          icon={TrendingUp}
          progressValue={75}
          animate={animateItems}
          animationDelay="400ms"
          locale={locale}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Engagement Over Time Chart */}
        <Card
          className={cn(
            "lg:col-span-2 transition-all duration-300 hover:shadow-md",
            animateItems
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4",
          )}
          style={{ animationDelay: "500ms" }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-5 text-primary" />
              {text.performanceChart?.title || "Engagement Over Time"}
            </CardTitle>
            <CardDescription>
              {text.performanceChart?.description ||
                "Monthly engagement metrics for your posts"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            {engagementChartData.length > 0 ? (
              <ChartContainer
                config={{
                  likes: {
                    label: text.analytics?.avgLikes || "Likes",
                    color: "hsl(var(--chart-1))",
                  },
                  comments: {
                    label: text.analytics?.avgComments || "Comments",
                    color: "hsl(var(--chart-2))",
                  },
                  shares: {
                    label: text.analytics?.avgShares || "Shares",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="w-full h-[350px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={engagementChartData}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      strokeOpacity={0.3}
                    />
                    <XAxis
                      dataKey="month"
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
                    <Legend
                      wrapperStyle={{ paddingTop: "20px" }}
                      iconType="line"
                    />
                    <Line
                      type="monotone"
                      dataKey="likes"
                      name={text.analytics?.avgLikes || "Likes"}
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
                      name={text.analytics?.avgComments || "Comments"}
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
                      name={text.analytics?.avgShares || "Shares"}
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
              <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                {text.recentPosts?.noPosts || "No data available"}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Breakdown */}
        <Card
          className={cn(
            "transition-all duration-300 hover:shadow-md",
            animateItems
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4",
          )}
          style={{ animationDelay: "600ms" }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" />
              {text.analytics?.performanceOverview || "Performance Overview"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-accent  rounded-md">
                    <Heart className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {text.analytics?.totalLikes || "Total Likes"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {posts.length} {text.stats?.posts || "posts"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {posts
                      .reduce((sum, p) => sum + (p.likeCount || 0), 0)
                      .toLocaleString()}
                  </p>
                  <div className="mt-1 w-16">
                    <Progress
                      value={75}
                      className="h-1"
                      dir={locale === "ar" ? "rtl" : "ltr"}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-chart-2/10 rounded-md">
                    <MessageCircle className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {text.analytics?.totalComments || "Total Comments"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {posts.length} {text.stats?.posts || "posts"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {posts
                      .reduce((sum, p) => sum + (p.commentsCount || 0), 0)
                      .toLocaleString()}
                  </p>
                  <div className="mt-1 w-16">
                    <Progress
                      value={60}
                      className="h-1"
                      dir={locale === "ar" ? "rtl" : "ltr"}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-accent rounded-md">
                    <Share2 className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {text.analytics?.totalShares || "Total Shares"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {posts.length} {text.stats?.posts || "posts"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {posts
                      .reduce((sum, p) => sum + (p.shareCount || 0), 0)
                      .toLocaleString()}
                  </p>
                  <div className="mt-1 w-16">
                    <Progress
                      value={45}
                      className="h-1"
                      dir={locale === "ar" ? "rtl" : "ltr"}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-primary/10 rounded-md">
                    <Eye className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {text.stats?.reach || "Total Reach"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {posts.length} {text.stats?.posts || "posts"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {analytics.totalReach.toLocaleString()}
                  </p>
                  <div className="mt-1 w-16">
                    <Progress
                      value={30}
                      className="h-1"
                      dir={locale === "ar" ? "rtl" : "ltr"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audience Insights */}
        <Card
          className={cn(
            "transition-all duration-300 hover:shadow-md",
            animateItems
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4",
          )}
          style={{ animationDelay: "700ms" }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5 text-primary" />
              {text.analytics?.audienceInsights || "Audience Insights"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <span className="text-sm font-medium">
                  {text.analytics?.topLocation || "Top Location"}
                </span>
                <span className="font-semibold">Saudi Arabia</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <span className="text-sm font-medium">
                  {text.analytics?.topAgeGroup || "Top Age Group"}
                </span>
                <span className="font-semibold">25-34</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {text.analytics?.maleAudience || "Male"}
                  </span>
                  <span className="font-semibold">58%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "58%" }} />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {text.analytics?.femaleAudience || "Female"}
                  </span>
                  <span className="font-semibold">42%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "42%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
