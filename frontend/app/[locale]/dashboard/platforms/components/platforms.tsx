"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/stat-card";
import {
  ArrowRight,
  Users,
  FileText,
  TrendingUp,
  Plus,
  Search,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import type { TConnectedAccount } from "@/types";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  getPlatformColor,
  getPlatformIcon,
} from "@/components/icons/platforms-icons";
import { PlatformConnectionDialog } from "../../settings/components/platform-connection-dialog";
import { cn } from "@/lib/utils";

interface PlatformsProps {
  text: any;
  locale: string;
  accounts: TConnectedAccount[];
}

export function Platforms({ text, locale, accounts }: PlatformsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [animateItems, setAnimateItems] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionProgress, setConnectionProgress] = useState<number | null>(
    null,
  );

  const statsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Trigger animations after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateItems(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const totalFollowers = accounts.reduce(
    (sum, acc) => sum + (acc.followersCount || 0),
    0,
  );
  const connectedCount = accounts.filter((acc) => acc.active).length;
  const connectionPercentage =
    accounts.length > 0
      ? Math.round((connectedCount / accounts.length) * 100)
      : 0;

  const filteredAccounts = accounts.filter(
    (account) =>
      account?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account?.provider?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleConnectPlatform = () => {
    setDialogOpen(true);
    toast.info("Opening platform connection...", {
      icon: <Plus className="h-4 w-4" />,
      duration: 1500,
    });
  };

  const handleViewPlatform = (platformName: string) => {
    setIsLoading(true);

    toast.loading(`Loading ${platformName}...`, {
      id: "load-platform",
    });

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Loaded ${platformName} successfully`, {
        id: "load-platform",
        icon: <CheckCircle className="h-4 w-4" />,
        duration: 2000,
      });
    }, 1000);
  };

  const handleDisconnectPlatform = (
    platformName: string,
    platformId: number,
  ) => {
    if (!confirm(`Are you sure you want to disconnect ${platformName}?`))
      return;

    setConnectionProgress(0);

    toast.loading(`Disconnecting ${platformName}...`, {
      id: "disconnect-platform",
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

      toast.success(`${platformName} disconnected successfully`, {
        id: "disconnect-platform",
        icon: <CheckCircle className="h-4 w-4" />,
        duration: 2000,
      });

      // Reset progress after a delay
      setTimeout(() => {
        setConnectionProgress(null);
      }, 1000);
    }, 1500);
  };

  return (
    <>
      {connectionProgress !== null && (
        <div className="fixed top-4 right-4 z-50 w-80 bg-background border rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Disconnecting platform...
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
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {text.title}
              </h1>
              <p className="text-muted-foreground mt-1">{text.subtitle}</p>
            </div>
            <Button
              onClick={handleConnectPlatform}
              className="gap-2 transition-all duration-300 hover:scale-105"
            >
              <Plus className="size-4" />
              {text.connectPlatform}
            </Button>
          </div>

          <div
            ref={statsRef}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            <StatCard
              title={text.stats.totalAccounts}
              value={accounts.length.toString()}
              description={`${connectedCount} ${text.connected.toLowerCase()}`}
              icon={Users}
              progressValue={connectionPercentage}
              animate={animateItems}
              animationDelay="100ms"
              locale={locale}
            />

            <StatCard
              title={text.stats.totalFollowers}
              value={totalFollowers.toLocaleString()}
              description={text.followers}
              icon={Users}
              animate={animateItems}
              animationDelay="200ms"
              locale={locale}
            />

            <StatCard
              title={text.stats.totalPosts}
              value="0"
              description={text.posts}
              icon={FileText}
              animate={animateItems}
              animationDelay="300ms"
              locale={locale}
            />

            <StatCard
              title={text.stats.avgEngagement}
              value="0%"
              description={text.engagement}
              icon={TrendingUp}
              animate={animateItems}
              animationDelay="400ms"
              locale={locale}
            />
          </div>

          {accounts.length > 0 && (
            <div
              className={cn(
                "flex flex-col gap-4 sm:flex-row sm:items-center transition-all duration-500",
                animateItems
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4",
              )}
              style={{ animationDelay: "500ms" }}
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder={text.searchPlaceholder || "Search platforms..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          )}

          {accounts.length === 0 ? (
            <Card
              className={cn(
                "border-dashed transition-all duration-500",
                animateItems ? "opacity-100 scale-100" : "opacity-0 scale-95",
              )}
              style={{ animationDelay: "600ms" }}
            >
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-8 mb-6 transition-all duration-300 hover:scale-110">
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
                  className="gap-2 transition-all duration-300 hover:scale-105"
                >
                  <Plus className="size-4" />
                  {text.connectPlatform}
                </Button>
              </CardContent>
            </Card>
          ) : filteredAccounts.length === 0 ? (
            <Card
              className={cn(
                "border-dashed transition-all duration-500",
                animateItems ? "opacity-100 scale-100" : "opacity-0 scale-95",
              )}
              style={{ animationDelay: "600ms" }}
            >
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-8 mb-6 transition-all duration-300 hover:scale-110">
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
            <div
              ref={cardsRef}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredAccounts.map((account, index) => {
                const PlatformIcon = getPlatformIcon(account.provider);
                const platformColor = getPlatformColor(account.provider);

                return (
                  <Card
                    key={account.id}
                    className={cn(
                      "group hover:shadow-xl hover:scale-[1.02] transition-all duration-150 overflow-hidden border-2 hover:border-primary",
                      animateItems
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4",
                    )}
                    style={{ animationDelay: `${700 + index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`p-3 rounded-xl ${platformColor} bg-opacity-10 `}
                        >
                          <PlatformIcon className="size-8" />
                        </div>
                        <Badge
                          variant={account.active ? "default" : "secondary"}
                          className={cn(
                            account.active
                              ? "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30"
                              : "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
                          )}
                        >
                          {account.active ? (
                            <>
                              <CheckCircle className="size-3 mr-1" />
                              {text.connected}
                            </>
                          ) : (
                            <>
                              <AlertCircle className="size-3 mr-1" />
                              {text.disconnected}
                            </>
                          )}
                        </Badge>
                      </div>

                      <div className="space-y-3 mb-5">
                        <div>
                          <h3 className="font-semibold text-xl truncate mb-1 ">
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

                      <div className="flex gap-2">
                        <Button
                          asChild
                          className="flex-1 group-hover:bg-primary transition-colors bg-transparent"
                          variant="outline"
                          onClick={() => handleViewPlatform(account.provider)}
                        >
                          <Link
                            href={`/${locale}/dashboard/platforms/${account.provider.toLowerCase()}-${account.id}`}
                          >
                            {text.viewPlatform}
                            {locale === "ar" ? (
                              <ArrowLeft className="ml-2 size-4 group-hover:-translate-x-1 transition-transform" />
                            ) : (
                              <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                            )}
                          </Link>
                        </Button>

                        {account.active && (
                          <Button
                            size="icon"
                            variant="outline"
                            className="transition-all duration-300 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 hover:border-red-300 bg-transparent"
                            onClick={() =>
                              handleDisconnectPlatform(
                                account.provider,
                                account.id,
                              )
                            }
                          >
                            {isLoading && connectionProgress !== null ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <AlertCircle className="size-4" />
                            )}
                          </Button>
                        )}
                      </div>
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
