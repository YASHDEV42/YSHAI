"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { connectInstagram } from "../actions";
import { ConnectedAccount } from "../../actions";

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
  onAccountConnected: (account: ConnectedAccountDetails) => void;
  text: any;
  locale: string;
}

export function PlatformConnectionDialog({
  open,
  onOpenChange,
  onAccountConnected,
  text,
}: PlatformConnectionDialogProps) {
  const [step, setStep] = useState<"select" | "connecting" | "details">(
    "select",
  );
  const [selectedPlatform, setSelectedPlatform] =
    useState<PlatformOption | null>(null);
  const [accountDetails, setAccountDetails] =
    useState<ConnectedAccountDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlatformSelect = (platform: PlatformOption) => {
    if (platform.id === "instagram") {
      // Redirect to Meta OAuth dialog handled by your backend
      const redirectUri = encodeURIComponent(
        `${window.location.origin}/auth/meta/callback`,
      );
      const clientId = process.env.NEXT_PUBLIC_META_APP_ID;
      const scope = `instagram_basic,instagram_manage_comments,instagram_manage_insights,instagram_content_publish,
      instagram_manage_messages,pages_read_engagement,pages_show_list,business_management`;
      const authUrl = `https://www.facebook.com/v24.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token`;

      window.location.href = authUrl;
    } else {
      // Other platforms are not ready yet
      setSelectedPlatform(platform);
      setStep("connecting");
    }
  };

  const handleInstagramLinked = async (data: ConnectedAccount) => {
    setAccountDetails({
      username: data.username || "Instagram User",
      profilePicture: data.profilePicture,
      accountType: data.accountType,
      followers: data.followers,
      provider: "instagram",
    });
    setStep("details");
  };

  const handleDone = () => {
    if (accountDetails) onAccountConnected(accountDetails);
    handleClose();
  };

  const handleClose = () => {
    setStep("select");
    setSelectedPlatform(null);
    setAccountDetails(null);
    setIsLoading(false);
    onOpenChange(false);
  };

  const handleBack = () => {
    setStep("select");
    setSelectedPlatform(null);
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {step === "select" && (
          <>
            <DialogHeader>
              <DialogTitle>{text.platforms.connectPlatform}</DialogTitle>
              <DialogDescription>
                {text.platforms.selectPlatform}
              </DialogDescription>
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
                  disabled={platform.status === "disabled" || isLoading}
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
          </>
        )}

        {step === "connecting" && (
          <>
            <DialogHeader>
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="size-4 mr-2" />
                {text.common.back}
              </Button>
              <DialogTitle>{text.platforms.connecting}</DialogTitle>
              <DialogDescription>
                {text.platforms.authorizingPlatform}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center py-8">
              {selectedPlatform && (
                <div
                  className={`flex size-20 items-center justify-center rounded-full ${selectedPlatform.color} mb-4 animate-pulse`}
                >
                  <selectedPlatform.icon className="size-10 text-white" />
                </div>
              )}
              <p className="text-sm text-muted-foreground text-center">
                {text.platforms.completeAuth}
              </p>
            </div>
          </>
        )}

        {step === "details" && accountDetails && (
          <>
            <DialogHeader>
              <DialogTitle>{text.platforms.accountConnected}</DialogTitle>
              <DialogDescription>
                {text.platforms.reviewDetails}
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="flex flex-col items-center gap-4 p-6 rounded-lg border border-border bg-muted/50">
                <Avatar className="size-20">
                  <AvatarImage
                    src={accountDetails.profilePicture || "/placeholder.svg"}
                  />
                  <AvatarFallback>{accountDetails.username[0]}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <p className="font-semibold text-lg">
                      {accountDetails.username}
                    </p>
                    <Badge
                      variant="default"
                      className="bg-green-500/20 text-green-600 dark:text-green-400"
                    >
                      <Check className="mr-1 size-3" />
                      {text.platforms.connected}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {accountDetails.accountType} •{" "}
                    {accountDetails.followers?.toLocaleString() ?? 0}{" "}
                    {text.platforms.followers}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleBack}>
                {text.platforms.connectAnother}
              </Button>
              <Button onClick={handleDone}>{text.common.done}</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
