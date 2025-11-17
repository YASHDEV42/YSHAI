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
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Users,
  FileText,
  TrendingUp,
  Plus,
  Search,
  Filter,
} from "lucide-react";
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const totalFollowers = accounts.reduce(
    (sum, acc) => sum + (acc.followersCount || 0),
    0,
  );
  const connectedCount = accounts.filter((acc) => acc.active).length;

  const filteredAccounts = accounts.filter(
    (account) =>
      account?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account?.provider?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background">
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {text.title}
              </h1>
              <p className="text-muted-foreground mt-1">{text.subtitle}</p>
            </div>
            <Button
              onClick={() => setDialogOpen(true)}
              size="lg"
              className="gap-2"
            >
              <Plus className="size-4" />
              {text.connectPlatform}
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {text.stats.totalAccounts}
                </CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="size-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{accounts.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {connectedCount} {text.connected.toLowerCase()}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {text.stats.totalFollowers}
                </CardTitle>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="size-5 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {totalFollowers.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {text.followers}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {text.stats.totalPosts}
                </CardTitle>
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <FileText className="size-5 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">0</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {text.posts}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {text.stats.avgEngagement}
                </CardTitle>
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <TrendingUp className="size-5 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">0%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {text.engagement}
                </p>
              </CardContent>
            </Card>
          </div>

          {accounts.length > 0 && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder={text.searchPlaceholder || "Search platforms..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}

          {accounts.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-8 mb-6">
                  <Users className="size-16 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {text.noPlatforms}
                </h3>
                <p className="text-sm text-muted-foreground mb-8 max-w-md">
                  {text.noPlatformsDescription}
                </p>
                <Button
                  size="lg"
                  onClick={() => setDialogOpen(true)}
                  className="gap-2"
                >
                  <Plus className="size-4" />
                  {text.connectPlatform}
                </Button>
              </CardContent>
            </Card>
          ) : filteredAccounts.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-8 mb-6">
                  <Search className="size-16 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {text.noResults || "No results found"}
                </h3>
                <p className="text-sm text-muted-foreground mb-8 max-w-md">
                  {text.noResultsDescription ||
                    "Try adjusting your search terms"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAccounts.map((account) => {
                const PlatformIcon = getPlatformIcon(account.provider);
                const platformColor = getPlatformColor(account.provider);

                return (
                  <Card
                    key={account.id}
                    className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden border-2 hover:border-primary/50"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`p-3 rounded-xl ${platformColor} bg-opacity-10`}
                        >
                          <PlatformIcon className="size-8" />
                        </div>
                        <Badge
                          variant={account.active ? "default" : "secondary"}
                          className={
                            account.active
                              ? "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30"
                              : "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30"
                          }
                        >
                          {account.active ? text.connected : text.disconnected}
                        </Badge>
                      </div>

                      <div className="space-y-3 mb-5">
                        <div>
                          <h3 className="font-semibold text-xl truncate mb-1">
                            {account.username}
                          </h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            {account.provider}
                          </p>
                        </div>

                        <div className="flex items-center gap-6 pt-2 border-t">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="p-1.5 bg-muted rounded-md">
                              <Users className="size-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-semibold">
                                {(account.followersCount || 0).toLocaleString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {text.followers}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="p-1.5 bg-muted rounded-md">
                              <FileText className="size-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-semibold">0</p>
                              <p className="text-xs text-muted-foreground">
                                {text.posts}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        asChild
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        variant="outline"
                      >
                        <Link
                          href={`/${locale}/dashboard/platforms/${account.provider.toLowerCase()}-${account.id}`}
                        >
                          {text.viewPlatform}
                          <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
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
