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
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { TConnectedAccount } from "@/types";

interface OverviewTabProps {
  text: any;
  locale: string;
  account: TConnectedAccount;
  posts: any[];
}

export function OverviewTab({
  text,
  locale,
  account,
  posts,
}: OverviewTabProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {text.stats.followers}
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(account.followersCount || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              0% {text.stats?.fromLastMonth || ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {text.stats.posts}
            </CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
            <p className="text-xs text-muted-foreground">
              {text.stats?.thisMonth || "this month"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {text.stats.engagement}
            </CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">
              +0% {text.stats?.fromLastWeek || ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {text.stats.reach}
            </CardTitle>
            <Eye className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +0% {text.stats?.fromLastWeek || ""}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>{text.recentPosts?.title || "Recent Posts"}</CardTitle>
          <CardDescription>
            {text.recentPosts?.description || "Your latest content"}
          </CardDescription>
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
              {posts.slice(0, 3).map((post) => (
                <div
                  key={post.id}
                  className="flex gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  {post.mediaUrl && (
                    <div className="relative size-20 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={post.mediaUrl || "/placeholder.svg"}
                        alt={post.caption || "Post image"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <p className="text-sm line-clamp-2">{post.caption}</p>
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
                    <Button variant="ghost" size="icon" asChild>
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
