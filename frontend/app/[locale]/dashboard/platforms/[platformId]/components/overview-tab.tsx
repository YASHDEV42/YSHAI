"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  FileText,
  TrendingUp,
  Eye,
  Plus,
  Heart,
  MessageCircle,
  ExternalLink,
  Activity,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { TConnectedAccount } from "@/types";
import { cn } from "@/lib/utils";

interface OverviewTabProps {
  text: any;
  locale: string;
  account: TConnectedAccount;
  posts: any[];
  animateItems?: boolean;
}

export function OverviewTab({
  text,
  locale,
  account,
  posts,
  animateItems = false,
}: OverviewTabProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate stats
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
  const avgEngagement =
    posts.length > 0
      ? Math.round((totalLikes + totalComments + totalShares) / posts.length)
      : 0;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card
          className={cn(
            "border-l-4 border-l-primary hover:border-l-accent transition-all duration-300 hover:shadow-md hover:scale-[1.02]",
            animateItems
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4",
          )}
          style={{ animationDelay: "100ms" }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {text.stats.followers}
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg transition-all duration-300 group-hover:scale-110">
              <Users className="size-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(account.followersCount || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              0% {text.stats?.fromLastMonth || ""}
            </p>
            <div className="mt-2">
              <Progress
                value={0}
                className="h-1"
                dir={locale === "ar" ? "rtl" : "ltr"}
              />
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "border-l-4 border-l-blue-500 hover:border-l-accent transition-all duration-300 hover:shadow-md hover:scale-[1.02]",
            animateItems
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4",
          )}
          style={{ animationDelay: "200ms" }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {text.stats.posts}
            </CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg transition-all duration-300 group-hover:scale-110">
              <FileText className="size-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {text.stats?.thisMonth || "this month"}
            </p>
            <div className="mt-2">
              <Progress
                value={posts.length > 0 ? Math.min(posts.length * 10, 100) : 0}
                className="h-1"
                dir={locale === "ar" ? "rtl" : "ltr"}
              />
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "border-l-4 border-l-green-500 hover:border-l-accent transition-all duration-300 hover:shadow-md hover:scale-[1.02]",
            animateItems
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4",
          )}
          style={{ animationDelay: "300ms" }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {text.stats.engagement}
            </CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg transition-all duration-300 group-hover:scale-110">
              <TrendingUp className="size-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgEngagement}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              +0% {text.stats?.fromLastWeek || ""}
            </p>
            <div className="mt-2">
              <Progress
                value={avgEngagement}
                className="h-1"
                dir={locale === "ar" ? "rtl" : "ltr"}
              />
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "border-l-4 border-l-orange-500 hover:border-l-accent transition-all duration-300 hover:shadow-md hover:scale-[1.02]",
            animateItems
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4",
          )}
          style={{ animationDelay: "400ms" }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {text.stats.reach}
            </CardTitle>
            <div className="p-2 bg-orange-500/10 rounded-lg transition-all duration-300 group-hover:scale-110">
              <Eye className="size-5 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              +0% {text.stats?.fromLastWeek || ""}
            </p>
            <div className="mt-2">
              <Progress
                value={0}
                className="h-1"
                dir={locale === "ar" ? "rtl" : "ltr"}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card
        className={cn(
          "transition-all duration-300 hover:shadow-md",
          animateItems
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4",
        )}
        style={{ animationDelay: "500ms" }}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-5 text-primary" />
            {text.performance?.title || "Performance Summary"}
          </CardTitle>
          <CardDescription>
            {text.performance?.description || "Key metrics for your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Heart className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {totalLikes.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Total Likes</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <MessageCircle className="size-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {totalComments.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Total Comments</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="size-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {totalShares.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Total Shares</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card
        className={cn(
          "transition-all duration-300 hover:shadow-md",
          animateItems
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4",
        )}
        style={{ animationDelay: "600ms" }}
      >
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>{text.recentPosts?.title || "Recent Posts"}</CardTitle>
            <CardDescription>
              {text.recentPosts?.description || "Your latest content"}
            </CardDescription>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="transition-all duration-300 hover:scale-105 bg-transparent"
          >
            <Link href={`/${locale}/dashboard/create`}>
              <Plus className="mr-2 size-4" />
              {text.createPost || "Create Post"}
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="size-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {text.recentPosts?.noPosts || "No posts yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {text.recentPosts?.noPostsDescription ||
                  "Start creating content to see it here"}
              </p>
              <Button asChild>
                <Link href={`/${locale}/dashboard/create`}>
                  <Plus className="mr-2 size-4" />
                  {text.createPost || "Create Post"}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.slice(0, 3).map((post, index) => (
                <div
                  key={post.id}
                  className={cn(
                    "flex gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-all duration-300 hover:scale-[1.01] hover:shadow-md group",
                    animateItems
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4",
                  )}
                  style={{ animationDelay: `${700 + index * 100}ms` }}
                >
                  {post.mediaUrl && (
                    <div className="relative size-20 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={post.mediaUrl || "/placeholder.svg"}
                        alt={post.caption || "Post image"}
                        fill
                        className="object-cover transition-all duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <p className="text-sm line-clamp-2 transition-colors group-hover:text-foreground">
                      {post.caption}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="size-4" />
                        {post.likeCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="size-4" />
                        {post.commentsCount || 0}
                      </span>
                      <span className="ml-auto">
                        {formatDate(post.timestamp)}
                      </span>
                    </div>
                  </div>
                  {post.permalink && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 transition-all duration-300 hover:scale-110 hover:bg-primary/10"
                      asChild
                    >
                      <a
                        href={post.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
