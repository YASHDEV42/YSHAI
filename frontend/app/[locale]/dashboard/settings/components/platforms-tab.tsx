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
import { Plus, Trash2, Check, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PlatformConnectionDialog } from "./platform-connection-dialog";
import type { TConnectedAccount } from "@/types";
import { disconnectAccount, reconnectAccount } from "@/lib/helper";

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

const getPlatformIcon = (provider: string) => {
  const providerLower = provider.toLowerCase();
  if (providerLower.includes("twitter") || providerLower.includes("x")) {
    return TwitterIcon;
  } else if (providerLower.includes("instagram")) {
    return InstagramIcon;
  } else if (providerLower.includes("linkedin")) {
    return LinkedInIcon;
  }
  return TwitterIcon;
};

interface PlatformsTabProps {
  text: any;
  locale: string;
  accounts: TConnectedAccount[];
}

export function PlatformsTab({ text, locale, accounts }: PlatformsTabProps) {
  console.log("Accounts:", accounts);
  const connectedPlatforms = accounts;

  const [dialogOpen, setDialogOpen] = useState(false);
  const handleReConnect = async (
    provider: "x" | "instagram" | "linkedin" | "tiktok",
    providerAccountId: string,
  ) => {
    const res = await reconnectAccount({ provider, providerAccountId });
  };
  const handleDisconnect = async (accountId: number) => {
    await disconnectAccount(accountId);
  };

  return (
    <>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>{text.platforms.title}</CardTitle>
          <CardDescription>{text.platforms.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {connectedPlatforms.length > 0 ? (
            connectedPlatforms.map((platform) => {
              const PlatformIcon = getPlatformIcon(platform.provider);

              return (
                <div
                  key={platform.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-card"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                      <PlatformIcon className="size-6 text-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{platform.provider}</p>
                        {platform.active ? (
                          <Badge
                            variant="default"
                            className="bg-green-500/20 text-green-600 dark:text-green-400"
                          >
                            <Check className="mr-1 size-3" />
                            {text.platforms.connected}
                          </Badge>
                        ) : (
                          <Badge
                            variant="default"
                            className="bg-red-500/20 text-red-600 dark:text-red-400"
                          >
                            <AlertCircle className="mr-1 size-3" />
                            {text.platforms.disconnected}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {locale === "ar" ? (
                          <>
                            {platform.followersCount} {text.platforms.followers}{" "}
                            • {platform.username}{" "}
                          </>
                        ) : (
                          <>
                            {platform.username} • {platform.followersCount}{" "}
                            {text.platforms.followers}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDialogOpen(true)}
                    >
                      {text.platforms.reconnect}
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => handleDisconnect(platform.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground text-center ">
              {text.platforms.noConnected}
            </p>
          )}

          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="mr-2 size-4" />
            {text.platforms.connectNew}
          </Button>
        </CardContent>
      </Card>

      <PlatformConnectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        text={text}
        locale={locale}
      />
    </>
  );
}
