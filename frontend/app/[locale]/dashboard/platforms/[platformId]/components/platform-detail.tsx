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

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.849.069-3.205 0-3.584-.012-4.849-.069-3.225-.149-4.771-1.664-4.919-4.919C2.164 15.585 2.152 15.205 2.152 12c0-3.204.012-3.584.07-4.849.148-3.225 1.691-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zM12 0C8.741 0 8.333.014 7.052.072 2.694.272.272 2.694.072 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.667-.014 4.948-.072 4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.948-.2-4.358-2.618-6.78-6.98-6.98C15.668.014 15.259 0 12 0z" />
    <path d="M12 5.838A6.162 6.162 0 1 0 12 18.162 6.162 6.162 0 1 0 12 5.838zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
    <circle cx="18.406" cy="5.594" r="1.44" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const getPlatformIcon = (provider: string) => {
  const providerLower = provider.toLowerCase();
  if (providerLower.includes("twitter") || providerLower.includes("x")) {
    return TwitterIcon;
  } else if (providerLower.includes("instagram")) {
    return InstagramIcon;
  } else if (providerLower.includes("linkedin")) {
    return LinkedInIcon;
  } else if (providerLower.includes("tiktok")) {
    return TikTokIcon;
  }
  return TwitterIcon;
};

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

  const posts = [
    {
      id: 1,
      content: "Excited to share our latest AI-powered features!",
      date: "2024-01-15",
      likes: 245,
      comments: 32,
      shares: 18,
      engagement: 4.2,
    },
    {
      id: 2,
      content: "Check out our new dashboard design",
      date: "2024-01-14",
      likes: 189,
      comments: 24,
      shares: 12,
      engagement: 3.8,
    },
  ];

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    setTimeout(() => {
      const responses = [
        text.aiAdvisor?.sampleResponse1 ||
          "Based on your audience, the best time to post is 2-4 PM.",
        text.aiAdvisor?.sampleResponse2 ||
          "Your engagement has increased by 12% this month!",
        text.aiAdvisor?.sampleResponse3 ||
          "Try posting more visual content for better engagement.",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: randomResponse,
        },
      ]);
      setIsLoading(false);
    }, 1500);
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
                          handleSendMessage();
                        }
                      }}
                      className=" resize-none"
                    />
                    <Button
                      onClick={handleSendMessage}
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
