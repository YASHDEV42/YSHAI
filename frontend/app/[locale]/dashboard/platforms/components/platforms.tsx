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
import { useState } from "react";
import {
  getPlatformColor,
  getPlatformIcon,
} from "@/components/icons/platforms-icons";
import { PlatformConnectionDialog } from "../../settings/components/platform-connection-dialog";

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
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background">
        {/* Main Content */}
        <main className="flex-1 p-4 space-y-4">
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
                <p className="text-xs text-muted-foreground">
                  {text.followers}
                </p>
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
                <p className="text-xs text-muted-foreground">
                  {text.engagement}
                </p>
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
                        className="overflow-hidden hover:shadow-lg transition-shadow py-0"
                      >
                        <CardContent className="p-0">
                          <div
                            className={`h-20 ${platformColor} flex items-center justify-center `}
                          >
                            <PlatformIcon className="size-12 text-white" />
                          </div>
                          <div className="p-4 space-y-3 flex flex-col justify-between">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-lg truncate ">
                                  {account.username}
                                </h3>
                                <p className="text-sm text-muted-foreground truncate">
                                  {account.provider}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  account.active ? "default" : "secondary"
                                }
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
                                  {(
                                    account.followersCount || 0
                                  ).toLocaleString()}
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
              <Button
                variant="outline"
                className="w-full bg-transparent mt-4"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="mr-2 size-4" />
                {text.connectPlatform}
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>

      <PlatformConnectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        text={text}
        locale={locale}
      />
    </>
  );
}
