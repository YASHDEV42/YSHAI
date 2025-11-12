"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Music2,
  Check,
  ArrowLeft,
  X,
} from "lucide-react";

type Platform = "facebook" | "x" | "instagram" | "linkedin" | "tiktok";

interface PlatformOption {
  id: Platform;
  name: string;
  icon: typeof Twitter;
  color: string;
  description: string;
  status: "disabled" | "enabled";
}

const platforms: PlatformOption[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500",
    description: "Share photos and stories on Instagram",
    status: "enabled",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "bg-blue-600",
    description: "Connect your Facebook account to schedule posts",
    status: "disabled", // handled indirectly via Instagram
  },
  {
    id: "x",
    name: "X (Twitter)",
    icon: X,
    color: "bg-black dark:bg-white",
    description: "Connect your X account to schedule tweets",
    status: "disabled",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    color: "bg-blue-600",
    description: "Post professional content on LinkedIn",
    status: "disabled",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Music2,
    color: "bg-black dark:bg-white",
    description: "Share short videos on TikTok",
    status: "disabled",
  },
];

interface ConnectedAccountDetails {
  username: string;
  profilePicture?: string;
  accountType?: string;
  followers?: number;
  provider: Platform;
}

interface PlatformConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  text: any;
  locale: string;
}

export function PlatformConnectionDialog({
  open,
  onOpenChange,
  text,
}: PlatformConnectionDialogProps) {
  useState<ConnectedAccountDetails | null>(null);

  const handlePlatformSelect = (platform: PlatformOption) => {
    if (platform.id === "instagram") {
      const redirectUri = encodeURIComponent(
        `${window.location.origin}/auth/meta/callback`,
      );
      const clientId = process.env.NEXT_PUBLIC_META_APP_ID;
      const scope = `instagram_basic,instagram_manage_comments,instagram_manage_insights,instagram_content_publish,
      instagram_manage_messages,pages_read_engagement,pages_show_list,business_management`;
      const authUrl = `https://www.facebook.com/v24.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token`;

      window.location.href = authUrl;
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{text.platforms.connectPlatform}</DialogTitle>
          <DialogDescription>{text.platforms.selectPlatform}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => handlePlatformSelect(platform)}
              className={`flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors text-left ${
                platform.status === "disabled"
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <div
                className={`flex size-12 items-center justify-center rounded-lg ${platform.color}`}
              >
                <platform.icon className="size-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{platform.name}</p>
                <p className="text-sm text-muted-foreground">
                  {platform.status === "disabled"
                    ? "Coming Soon..."
                    : platform.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
