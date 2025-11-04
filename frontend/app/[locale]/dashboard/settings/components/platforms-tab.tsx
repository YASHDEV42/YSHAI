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
import { getPlatformIcon } from "@/components/icons/platforms-icons";

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
