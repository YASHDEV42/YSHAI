"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Twitter,
  Instagram,
  Linkedin,
  Plus,
  Trash2,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PlatformConnectionDialog } from "./platform-connection-dialog";
import { TConnectedAccount } from "@/types";

interface PlatformsTabProps {
  text: any;
  locale: string;
  accounts: TConnectedAccount[];
}

export function PlatformsTab({ text, locale, accounts }: PlatformsTabProps) {
  console.log("Accounts:", accounts);
  const connectedPlatforms = accounts;
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleAccountConnected = () => {};

  return (
    <>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>{text.platforms.title}</CardTitle>
          <CardDescription>{text.platforms.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {connectedPlatforms.length > 0 ? (
            connectedPlatforms.map((platform) => (
              <div
                key={platform.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-card"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                    {/* Icon */}
                    {/* <platform.icon className="size-6 text-foreground" /> */}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{platform.provider}</p>
                      {platform.active && (
                        <Badge
                          variant="default"
                          className="bg-green-500/20 text-green-600 dark:text-green-400"
                        >
                          <Check className="mr-1 size-3" />
                          {text.platforms.connected}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {platform.username} • {platform.followers}{" "}
                      {text.platforms.followers}
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
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                    <span className="sr-only">{text.platforms.disconnect}</span>
                  </Button>
                </div>
              </div>
            ))
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
        onAccountConnected={handleAccountConnected}
        text={text}
        locale={locale}
      />
    </>
  );
}
