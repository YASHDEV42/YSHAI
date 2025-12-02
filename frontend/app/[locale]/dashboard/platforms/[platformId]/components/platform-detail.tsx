"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Plus,
  CheckCircle,
  AlertCircle,
  Zap,
  Activity,
} from "lucide-react";
import Link from "next/link";
import type { TConnectedAccount } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OverviewTab } from "./overview-tab";
import { ContentTab } from "./content-tab";
import { AIAgentTab } from "./ai-agent-tab";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AnalyticsTab } from "./analytics-tab";

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
  const [animateItems, setAnimateItems] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >(account.active ? "connected" : "disconnected");
  const [connectionProgress, setConnectionProgress] = useState<number | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("overview");

  const headerRef = useRef<HTMLDivElement>(null);

  // Trigger animations after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateItems(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleConnectPlatform = () => {
    if (account.active) {
      // Disconnect logic
      if (!confirm(`Are you sure you want to disconnect ${account.provider}?`))
        return;

      setConnectionStatus("connecting");
      setConnectionProgress(0);

      toast.loading(`Disconnecting ${account.provider}...`, {
        id: "connection-status",
      });

      // Simulate progress
      const progressInterval = setInterval(() => {
        setConnectionProgress((prev) => {
          if (prev === null) return 20;
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Simulate completion
      setTimeout(() => {
        clearInterval(progressInterval);
        setConnectionProgress(100);
        setConnectionStatus("disconnected");

        toast.success(`${account.provider} disconnected successfully`, {
          id: "connection-status",
          icon: <CheckCircle className="h-4 w-4" />,
          duration: 2000,
        });

        // Reset progress after a delay
        setTimeout(() => {
          setConnectionProgress(null);
        }, 1000);
      }, 1500);
    } else {
      // Connect logic
      setConnectionStatus("connecting");
      setConnectionProgress(0);

      toast.loading(`Connecting to ${account.provider}...`, {
        id: "connection-status",
      });

      // Simulate progress
      const progressInterval = setInterval(() => {
        setConnectionProgress((prev) => {
          if (prev === null) return 20;
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Simulate completion
      setTimeout(() => {
        clearInterval(progressInterval);
        setConnectionProgress(100);
        setConnectionStatus("connected");

        toast.success(`${account.provider} connected successfully`, {
          id: "connection-status",
          icon: <CheckCircle className="h-4 w-4" />,
          duration: 2000,
        });

        // Reset progress after a delay
        setTimeout(() => {
          setConnectionProgress(null);
        }, 1000);
      }, 1500);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <>
      {connectionProgress !== null && (
        <div className="fixed top-4 right-4 z-50 w-80 bg-background border rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {connectionStatus === "connecting"
                ? `${account.active ? "Disconnecting" : "Connecting"} ${account.provider}...`
                : "Processing..."}
            </span>
            <span className="text-sm text-muted-foreground">
              {connectionProgress}%
            </span>
          </div>
          <Progress
            value={connectionProgress}
            className="h-2"
            dir={locale === "ar" ? "rtl" : "ltr"}
          />
        </div>
      )}

      <div className="flex flex-col min-h-screen bg-background">
        {/* Header */}
        <header
          ref={headerRef}
          className={cn(
            "sticky top-0 z-10 border-b border-border bg-background transition-all duration-500",
            animateItems
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4",
          )}
        >
          <div className="flex h-16 items-center gap-4 px-6">
            <SidebarTrigger className="lg:hidden" />
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="transition-all duration-300 hover:scale-105"
            >
              <Link href={`/${locale}/dashboard/platforms`}>
                <ArrowLeft className="mr-2 size-4" />
                {text.backToPlatforms || text.back}
              </Link>
            </Button>
          </div>

          {/* Platform Header */}
          <div className="px-6 py-6 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="flex size-16 items-center justify-center rounded-full bg-muted transition-all duration-300 group-hover:scale-110">
                  <Avatar className="w-16 h-16 border-2 border-primary">
                    {account.profilePictureUrl ? (
                      <AvatarImage
                        src={account.profilePictureUrl}
                        alt={account.provider}
                        className="rounded-full object-cover"
                        width={64}
                        height={64}
                      />
                    ) : (
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        {account.provider
                          ? account.provider.slice(0, 2).toUpperCase()
                          : "??"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
                <div
                  className={cn(
                    "absolute -bottom-1 -right-1 size-4 rounded-full flex items-center justify-center transition-all duration-300",
                    connectionStatus === "connected" && "bg-green-500",
                    connectionStatus === "disconnected" && "bg-red-500",
                    connectionStatus === "connecting" &&
                      "bg-yellow-500 animate-pulse",
                  )}
                >
                  {connectionStatus === "connected" && (
                    <CheckCircle className="size-3 text-white" />
                  )}
                  {connectionStatus === "disconnected" && (
                    <AlertCircle className="size-3 text-white" />
                  )}
                  {connectionStatus === "connecting" && (
                    <Activity className="size-3 text-white animate-pulse" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold capitalize transition-colors group-hover:text-primary">
                    {account.provider}
                  </h1>
                  <Badge
                    variant={
                      connectionStatus === "connected" ? "default" : "secondary"
                    }
                    className={cn(
                      "transition-all duration-300",
                      connectionStatus === "connected"
                        ? "bg-green-500/20 text-green-600 dark:text-green-400"
                        : connectionStatus === "connecting"
                          ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 animate-pulse"
                          : "bg-red-500/20 text-red-600 dark:text-red-400",
                    )}
                  >
                    {connectionStatus === "connected" && (
                      <>
                        <CheckCircle className="size-3 mr-1" />
                        {text.connected}
                      </>
                    )}
                    {connectionStatus === "disconnected" && (
                      <>
                        <AlertCircle className="size-3 mr-1" />
                        {text.disconnected}
                      </>
                    )}
                    {connectionStatus === "connecting" && (
                      <>
                        <Activity className="size-3 mr-1 animate-pulse" />
                        {text.connecting || "Connecting..."}
                      </>
                    )}
                  </Badge>
                </div>
                <p className="text-muted-foreground">@{account.username}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  asChild
                  className="transition-all duration-300 hover:scale-105"
                >
                  <Link href={`/${locale}/dashboard/create`}>
                    <Plus className="mr-2 size-4" />
                    {text.quickActions?.createPost || text.createPost}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleConnectPlatform}
                  disabled={connectionStatus === "connecting"}
                  className={cn(
                    "transition-all duration-300 hover:scale-105",
                    connectionStatus === "connecting" &&
                      "opacity-50 cursor-not-allowed",
                  )}
                >
                  {connectionStatus === "connecting" ? (
                    <>
                      <Activity className="mr-2 size-4 animate-pulse" />
                      {text.connecting || "Connecting..."}
                    </>
                  ) : connectionStatus === "connected" ? (
                    <>
                      <AlertCircle className="mr-2 size-4" />
                      {text.disconnect || "Disconnect"}
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 size-4" />
                      {text.connect || "Connect"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={handleTabChange}
            className="space-y-6"
            dir={locale === "ar" ? "rtl" : "ltr"}
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger
                value="overview"
                className="transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {text.tabs?.overview || text.overview}
              </TabsTrigger>
              <TabsTrigger
                value="content"
                className="transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {text.tabs?.content || text.content}
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {text.tabs?.analytics || text.analytics}
              </TabsTrigger>
              <TabsTrigger
                value="insights"
                className="transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {text.tabs?.aiAdvisor || text.insights}
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="overview"
              className={cn(
                "transition-all duration-500",
                activeTab === "overview"
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4",
              )}
            >
              <OverviewTab
                text={text}
                locale={locale}
                account={account}
                posts={posts}
                animateItems={animateItems}
              />
            </TabsContent>

            <TabsContent
              value="content"
              className={cn(
                "transition-all duration-500",
                activeTab === "content"
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4",
              )}
            >
              <ContentTab
                text={text}
                locale={locale}
                posts={posts}
                animateItems={animateItems}
              />
            </TabsContent>

            <TabsContent
              value="analytics"
              className={cn(
                "transition-all duration-500",
                activeTab === "analytics"
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4",
              )}
            >
              <AnalyticsTab
                text={text}
                locale={locale}
                posts={posts}
                animateItems={animateItems}
              />
            </TabsContent>

            <TabsContent
              value="insights"
              className={cn(
                "transition-all duration-500",
                activeTab === "insights"
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4",
              )}
            >
              <AIAgentTab
                text={text}
                locale={locale}
                account={account}
                animateItems={animateItems}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}
