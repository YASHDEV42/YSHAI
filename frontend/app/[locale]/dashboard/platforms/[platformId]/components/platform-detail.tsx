"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import type { TConnectedAccount } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OverviewTab } from "./overview-tab";
import { ContentTab } from "./content-tab";
import { AnalyticsTab } from "./analytics-tab";
import { AIAgentTab } from "./ai-agent-tab";

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
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
              <Avatar className="w-16 h-16 border-2 border-primary">
                {account.profilePictureUrl ? (
                  <AvatarImage
                    src={account.profilePictureUrl || "/placeholder.svg"}
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

          <TabsContent value="overview">
            <OverviewTab
              text={text}
              locale={locale}
              account={account}
              posts={posts}
            />
          </TabsContent>

          <TabsContent value="content">
            <ContentTab text={text} locale={locale} posts={posts} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab text={text} locale={locale} posts={posts} />
          </TabsContent>

          <TabsContent value="insights">
            <AIAgentTab text={text} account={account} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
