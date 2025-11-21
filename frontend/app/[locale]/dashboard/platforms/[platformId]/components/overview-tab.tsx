"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { StatCard } from "@/components/ui/stat-card";
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={text.stats.followers}
          value={(account.followersCount || 0).toLocaleString()}
          description={`0% ${text.stats?.fromLastMonth || ""}`}
          icon={Users}
          progressValue={0}
          animate={animateItems}
          animationDelay="100ms"
          locale={locale}
        />
        <StatCard
          title={text.stats.posts}
          value={posts.length.toString()}
          description={text.stats?.thisMonth || "this month"}
          icon={FileText}
          progressValue={
            posts.length > 0 ? Math.min(posts.length * 10, 100) : 0
          }
          animate={animateItems}
          animationDelay="200ms"
          locale={locale}
        />
        <StatCard
          title={text.stats.engagement}
          value={`${avgEngagement}%`}
          description={`+0% ${text.stats?.fromLastWeek || ""}`}
          icon={TrendingUp}
          progressValue={avgEngagement}
          animate={animateItems}
          animationDelay="300ms"
          locale={locale}
        />
        <StatCard
          title={text.stats.reach}
          value="0"
          description={`+0% ${text.stats?.fromLastWeek || ""}`}
          icon={Eye}
          progressValue={0}
          animate={animateItems}
          animationDelay="400ms"
          locale={locale}
        />
      </div>

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
                        src={post.mediaUrl}
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
