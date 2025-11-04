"use client";

import { useState } from "react";

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
} from "lucide-react";
import Link from "next/link";
import type { TConnectedAccount } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPlatformIcon } from "@/components/icons/platforms-icons";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface PlatformDetailProps {
  text: any;
  locale: string;
  account: TConnectedAccount;
}

export function PlatformDetail({ text, locale, account }: PlatformDetailProps) {
  const PlatformIcon = getPlatformIcon(account.provider);
  const [posts, setPosts] = useState<any[]>([]);
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
                    +12% {text.stats?.fromLastMonth || ""}
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
                  <div className="text-2xl font-bold">4.2%</div>
                  <p className="text-xs text-muted-foreground">
                    +0.5% {text.stats?.fromLastWeek || ""}
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
                  <div className="text-2xl font-bold">12.5K</div>
                  <p className="text-xs text-muted-foreground">
                    +8% {text.stats?.fromLastWeek || ""}
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
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="flex gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                    >
                      <Avatar className="size-12">
                        <AvatarImage
                          src={account.profilePicture || "/placeholder.svg"}
                        />
                        <AvatarFallback>
                          {account.username?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <p className="text-sm">{post.content}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Heart className="size-4" />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="size-4" />
                            {post.comments}
                          </span>
                          <span className="flex items-center gap-1">
                            <Share2 className="size-4" />
                            {post.shares}
                          </span>
                          <span className="ml-auto">{post.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {text.contentLibrary || "Content Library"}
                </CardTitle>
                <CardDescription>
                  {text.contentLibraryDescription || "All your posts"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <Card key={post.id} className="overflow-hidden">
                      <CardContent className="p-4 space-y-3">
                        <p className="text-sm line-clamp-3">{post.content}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{post.date}</span>
                          <Badge variant="secondary">
                            {post.engagement}% {text.engagement || "engagement"}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-transparent"
                          >
                            {text.edit || "Edit"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-transparent"
                          >
                            {text.repost || "Repost"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
