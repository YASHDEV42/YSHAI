"use client";

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
import { ArrowRight, Users, FileText, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";
import type { TConnectedAccount } from "@/types";

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
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

const getPlatformColor = (provider: string) => {
  const providerLower = provider.toLowerCase();
  if (providerLower.includes("twitter") || providerLower.includes("x")) {
    return "bg-black dark:bg-white";
  } else if (providerLower.includes("instagram")) {
    return "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500";
  } else if (providerLower.includes("linkedin")) {
    return "bg-blue-600";
  } else if (providerLower.includes("tiktok")) {
    return "bg-black";
  }
  return "bg-primary";
};

interface PlatformsProps {
  text: any;
  locale: string;
  accounts: TConnectedAccount[];
}

export function Platforms({ text, locale, accounts }: PlatformsProps) {
  const totalFollowers = accounts.reduce(
    (sum, acc) => sum + (acc.followersCount || 0),
    0,
  );
  const connectedCount = accounts.filter((acc) => acc.active).length;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-background px-6">
        <SidebarTrigger className="lg:hidden" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{text.title}</h1>
          <p className="text-sm text-muted-foreground">{text.subtitle}</p>
        </div>
        <Button asChild>
          <Link href={`/${locale}/dashboard/settings?tab=platforms`}>
            <Plus className="mr-2 size-4" />
            {text.connectPlatform}
          </Link>
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {text.stats.totalAccounts}
              </CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{accounts.length}</div>
              <p className="text-xs text-muted-foreground">
                {connectedCount} {text.connected.toLowerCase()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {text.stats.totalFollowers}
              </CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalFollowers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">{text.followers}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {text.stats.totalPosts}
              </CardTitle>
              <FileText className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">{text.posts}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {text.stats.avgEngagement}
              </CardTitle>
              <TrendingUp className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <p className="text-xs text-muted-foreground">{text.engagement}</p>
            </CardContent>
          </Card>
        </div>

        {/* Platforms List */}
        <Card>
          <CardHeader>
            <CardTitle>{text.title}</CardTitle>
            <CardDescription>{text.subtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            {accounts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <Users className="size-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {text.noPlatforms}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md">
                  {text.noPlatformsDescription}
                </p>
                <Button asChild>
                  <Link href={`/${locale}/dashboard/settings?tab=platforms`}>
                    <Plus className="mr-2 size-4" />
                    {text.connectPlatform}
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {accounts.map((account) => {
                  const PlatformIcon = getPlatformIcon(account.provider);
                  const platformColor = getPlatformColor(account.provider);

                  return (
                    <Card
                      key={account.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-0">
                        <div
                          className={`h-24 ${platformColor} flex items-center justify-center`}
                        >
                          <PlatformIcon className="size-12 text-white" />
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg truncate capitalize">
                                {account.provider}
                              </h3>
                              <p className="text-sm text-muted-foreground truncate">
                                @{account.username}
                              </p>
                            </div>
                            <Badge
                              variant={account.active ? "default" : "secondary"}
                              className={
                                account.active
                                  ? "bg-green-500/20 text-green-600 dark:text-green-400"
                                  : "bg-red-500/20 text-red-600 dark:text-red-400"
                              }
                            >
                              {account.active
                                ? text.connected
                                : text.disconnected}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="size-4" />
                              <span>
                                {(account.followersCount || 0).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="size-4" />
                              <span>0 {text.posts}</span>
                            </div>
                          </div>

                          <Button
                            asChild
                            className="w-full bg-transparent"
                            variant="outline"
                          >
                            <Link
                              href={`/${locale}/dashboard/platforms/${account.provider.toLowerCase()}-${account.id}`}
                            >
                              {text.viewPlatform}
                              <ArrowRight className="ml-2 size-4" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
