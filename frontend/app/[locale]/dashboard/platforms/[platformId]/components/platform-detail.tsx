"use client";

import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Users,
  FileText,
  TrendingUp,
  Eye,
  Sparkles,
  Plus,
  Send,
  Loader2,
  Heart,
  MessageCircle,
  Share2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import type { TConnectedAccount } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPlatformIcon } from "@/components/icons/platforms-icons";
import Image from "next/image";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface PlatformDetailProps {
  text: any;
  locale: string;
  account: TConnectedAccount;
  posts?: any[];
}

export function PlatformDetail({
  text,
  locale,
  account,
  posts = [],
}: PlatformDetailProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);
  const PlatformIcon = getPlatformIcon(account.provider);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        text.aiAdvisor?.welcomeMessage ||
        "Hello! How can I help you with your content strategy today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background">
        <div className="flex h-16 items-center gap-4 px-6">
          <SidebarTrigger className="lg:hidden" />
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/${locale}/dashboard/platforms`}>
              <ArrowLeft className="mr-2 size-4" />
              {text.backToPlatforms || text.back}
            </Link>
          </Button>
        </div>

        {/* Platform Header */}
        <div className="px-6 py-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-lg bg-muted">
              <PlatformIcon className="size-8 text-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold capitalize">
                  {account.provider}
                </h1>
                <Badge
                  variant={account.active ? "default" : "secondary"}
                  className={
                    account.active
                      ? "bg-green-500/20 text-green-600 dark:text-green-400"
                      : "bg-red-500/20 text-red-600 dark:text-red-400"
                  }
                >
                  {account.active ? text.connected : text.disconnected}
                </Badge>
              </div>
              <p className="text-muted-foreground">@{account.username}</p>
            </div>
            <Button asChild>
              <Link href={`/${locale}/dashboard/create`}>
                <Plus className="mr-2 size-4" />
                {text.quickActions?.createPost || text.createPost}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Tabs
          defaultValue="overview"
          className="space-y-6"
          dir={locale === "ar" ? "rtl" : "ltr"}
        >
          <TabsList>
            <TabsTrigger value="overview">
              {text.tabs?.overview || text.overview}
            </TabsTrigger>
            <TabsTrigger value="content">
              {text.tabs?.content || text.content}
            </TabsTrigger>
            <TabsTrigger value="analytics">
              {text.tabs?.analytics || text.analytics}
            </TabsTrigger>
            <TabsTrigger value="insights">
              {text.tabs?.aiAdvisor || text.insights}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats */}
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
                    {/*TODO:*/}
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
                <CardTitle>
                  {text.recentPosts?.title || "Recent Posts"}
                </CardTitle>
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
            </Card>{" "}
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {text.contentLibrary || "Content Library"}
                </CardTitle>
                <CardDescription>
                  {text.contentLibraryDescription || "All your posts"} (
                  {posts.length} {text.stats?.posts || "posts"})
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
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {currentPosts.map((post) => (
                        <Card key={post.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            {post.mediaUrl && (
                              <Carousel className="w-full">
                                <CarouselContent>
                                  <CarouselItem>
                                    <div className="relative aspect-square w-full">
                                      <Image
                                        src={
                                          post.mediaUrl || "/placeholder.svg"
                                        }
                                        alt={post.caption || "Post image"}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  </CarouselItem>
                                </CarouselContent>
                                <CarouselPrevious className="left-2" />
                                <CarouselNext className="right-2" />
                              </Carousel>
                            )}
                            <div className="p-4 space-y-3">
                              <p className="text-sm line-clamp-3">
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
                              <div className="flex gap-2">
                                {post.permalink && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 bg-transparent"
                                    asChild
                                  >
                                    <a
                                      href={post.permalink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <ExternalLink className="mr-2 size-3" />
                                      View
                                    </a>
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 bg-transparent"
                                >
                                  {text.repost || "Repost"}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() =>
                                setCurrentPage((prev) => Math.max(1, prev - 1))
                              }
                              className={
                                currentPage === 1
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1,
                          ).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() =>
                                setCurrentPage((prev) =>
                                  Math.min(totalPages, prev + 1),
                                )
                              }
                              className={
                                currentPage === totalPages
                                  ? "pointer-events-none opacity-50"
                                  : "cursor-pointer"
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {text.analytics?.performanceOverview ||
                      "Performance Overview"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {text.analytics?.avgLikes || "Avg Likes"}
                      </span>
                      <span className="font-semibold">217</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {text.analytics?.avgComments || "Avg Comments"}
                      </span>
                      <span className="font-semibold">28</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {text.analytics?.avgShares || "Avg Shares"}
                      </span>
                      <span className="font-semibold">15</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {text.analytics?.bestPostTime || "Best Time"}
                      </span>
                      <span className="font-semibold">2:00 PM</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {text.analytics?.audienceInsights || "Audience Insights"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {text.analytics?.topLocation || "Top Location"}
                      </span>
                      <span className="font-semibold">Saudi Arabia</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {text.analytics?.topAgeGroup || "Top Age"}
                      </span>
                      <span className="font-semibold">25-34</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {text.analytics?.maleAudience || "Male"}
                      </span>
                      <span className="font-semibold">58%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {text.analytics?.femaleAudience || "Female"}
                      </span>
                      <span className="font-semibold">42%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="size-5 text-primary" />
                  {text.aiAdvisor?.title ||
                    text.aiInsights?.title ||
                    "AI Advisor"}
                </CardTitle>
                <CardDescription>
                  {text.aiAdvisor?.description ||
                    text.aiInsights?.description ||
                    "Get personalized insights"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Chat Messages */}
                  <div className="space-y-4 max-h-[400px] overflow-y-auto p-4 rounded-lg bg-background border border-border">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.role === "assistant" && (
                          <div className="flex size-8 items-center justify-center rounded-full bg-primary shrink-0">
                            <Sparkles className="size-4 text-primary-foreground" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                        {message.role === "user" && (
                          <Avatar className="size-8 shrink-0">
                            <AvatarFallback>
                              {account.username?.[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary shrink-0">
                          <Sparkles className="size-4 text-primary-foreground" />
                        </div>
                        <div className="bg-muted rounded-lg p-3">
                          <Loader2 className="size-4 animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input Area */}
                  <div className="flex gap-2 justify-center items-center">
                    <Textarea
                      placeholder={
                        text.aiAdvisor?.inputPlaceholder || "Ask me anything..."
                      }
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                        }
                      }}
                      className=" resize-none"
                    />
                    <Button
                      disabled={!input.trim() || isLoading}
                      size="icon"
                      className="shrink-0 "
                    >
                      <Send className="size-4" />
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setInput(
                          text.aiAdvisor?.quickAction1 ||
                            "What's the best time to post?",
                        )
                      }
                    >
                      {text.aiAdvisor?.quickAction1 || "Best time to post?"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setInput(
                          text.aiAdvisor?.quickAction2 ||
                            "Analyze my performance",
                        )
                      }
                    >
                      {text.aiAdvisor?.quickAction2 || "Analyze performance"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setInput(
                          text.aiAdvisor?.quickAction3 ||
                            "Suggest content ideas",
                        )
                      }
                    >
                      {text.aiAdvisor?.quickAction3 || "Content ideas"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
