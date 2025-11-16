"use client";

import type React from "react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Sparkles, X, ImageIcon, Video, Loader2 } from "lucide-react";
import {
  getPlatformColor,
  getPlatformIcon,
} from "@/components/icons/platforms-icons";
import { createPostAction } from "../actions";
import { IUser, ISocialAccount } from "@/interfaces";

export default function CreatePage({
  text,
  locale,
  user,
  accounts,
}: {
  text: any;
  locale: string;
  user: IUser; // <--- REAL AUTH USER
  accounts: ISocialAccount[]; // <--- REAL CONNECTED ACCOUNTS
}) {
  // --------------------------------------------------
  // STATE
  // --------------------------------------------------
  const [contentAr, setContentAr] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [contentTab, setContentTab] = useState<"ar" | "en">("en");

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [uploadedMedia, setUploadedMedia] = useState<string[]>([]);
  const [scheduleType, setScheduleType] = useState<"now" | "later">("now");
  const [aiPrompt, setAiPrompt] = useState("");

  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const [isPending, startTransition] = useTransition();

  // --------------------------------------------------
  // Platform List (dynamic from backend)
  // --------------------------------------------------
  const platforms = accounts.map((acc) => ({
    id: acc.provider,
    name: text.platforms[acc.provider],
    socialAccountId: acc.id,
  }));

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId],
    );
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newMedia = Array.from(files).map((file) =>
        URL.createObjectURL(file),
      );
      setUploadedMedia((prev) => [...prev, ...newMedia]);
    }
  };

  const removeMedia = (index: number) => {
    setUploadedMedia((prev) => prev.filter((_, i) => i !== index));
  };

  // --------------------------------------------------
  // FORM SUBMISSION
  // --------------------------------------------------
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createPostAction(
        { success: false, enMessage: "", arMessage: "" },
        formData,
      );

      if (result.success) {
        // Reset form (optional)
        setContentAr("");
        setContentEn("");
        setSelectedPlatforms([]);
        setUploadedMedia([]);
        setScheduleDate("");
        setScheduleTime("");
      }
    });
  };

  // --------------------------------------------------
  // Unified Preview Component
  // --------------------------------------------------
  const currentContent = contentTab === "ar" ? contentAr : contentEn;

  const UnifiedPreview = ({
    platform,
  }: {
    platform: (typeof platforms)[0];
  }) => {
    const PlatformIcon = getPlatformIcon(platform.id);

    return (
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-semibold text-sm">
              Y
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">YSHAI</span>
              <PlatformIcon className="w-4 h-4" />
              <span className="text-muted-foreground text-xs">· now</span>
            </div>
            <div className="text-xs text-muted-foreground">{platform.name}</div>
          </div>
        </div>

        <p className="whitespace-pre-wrap text-sm leading-relaxed mb-3">
          {currentContent || text.preview.noContent}
        </p>

        {uploadedMedia.length > 0 && (
          <div className="mt-3">
            {uploadedMedia.length === 1 ? (
              <img
                src={uploadedMedia[0] || "/placeholder.svg"}
                alt="Preview"
                className="w-full rounded-lg object-cover max-h-80"
              />
            ) : (
              <Carousel className="w-full">
                <CarouselContent>
                  {uploadedMedia.map((media, index) => (
                    <CarouselItem key={index}>
                      <img
                        src={media}
                        alt={`Preview ${index + 1}`}
                        className="w-full rounded-lg object-cover max-h-80"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            )}
          </div>
        )}
      </div>
    );
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <form onSubmit={handleSubmit}>
          {/* Hidden required fields (SAFE) */}
          <input type="hidden" name="authorId" value={user.id} />

          {/* Render selected platform account IDs */}
          {platforms.map((platform) =>
            selectedPlatforms.includes(platform.id) ? (
              <input
                key={platform.id}
                type="hidden"
                name="socialAccountIds"
                value={platform.socialAccountId}
              />
            ) : null,
          )}

          {/* ScheduledAt (if scheduled) */}
          {scheduleDate && scheduleTime && (
            <input
              type="hidden"
              name="scheduledAt"
              value={`${scheduleDate}T${scheduleTime}:00`}
            />
          )}

          {/* Status */}
          <input
            type="hidden"
            name="status"
            value={scheduleType === "later" ? "scheduled" : "draft"}
          />

          <div className="grid lg:grid-cols-2 gap-6 items-start">
            {/* LEFT SIDE — Editor */}
            <div className="space-y-4">
              {/* PLATFORM SELECTION */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {text.platforms.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {platforms.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        Connect a social account to start posting.
                      </p>
                    )}

                    {platforms.map((platform) => {
                      const PlatformIcon = getPlatformIcon(platform.id);
                      const isSelected = selectedPlatforms.includes(
                        platform.id,
                      );

                      return (
                        <Button
                          key={platform.id}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePlatformToggle(platform.id)}
                          className={
                            isSelected ? getPlatformColor(platform.id) : ""
                          }
                        >
                          <PlatformIcon className="w-3.5 h-3.5 mr-1.5" />
                          <span className="text-xs">{platform.name}</span>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* MEDIA UPLOAD */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {text.media.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-lg border-2 border-dashed hover:border-primary/50 cursor-pointer">
                      <ImageIcon className="w-5 h-5 text-muted-foreground" />
                      <span className="text-xs">{text.media.uploadImage}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleMediaUpload}
                        className="hidden"
                      />
                    </label>

                    <label className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-lg border-2 border-dashed hover:border-primary/50 cursor-pointer">
                      <Video className="w-5 h-5 text-muted-foreground" />
                      <span className="text-xs">{text.media.uploadVideo}</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleMediaUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {uploadedMedia.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {uploadedMedia.map((media, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={media}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeMedia(index)}
                            className="absolute top-0.5 right-0.5 p-0.5 bg-background/90 rounded-full opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* CONTENT EDITOR */}
              <Card>
                <CardHeader>
                  <CardTitle>{text.contentEditor.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Tabs
                    value={contentTab}
                    onValueChange={(v) => setContentTab(v as any)}
                  >
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="ar">العربية</TabsTrigger>
                    </TabsList>

                    <TabsContent value="en" className="mt-3">
                      <Textarea
                        name="contentEn"
                        value={contentEn}
                        onChange={(e) => setContentEn(e.target.value)}
                        placeholder={text.contentEditor.placeholder}
                        className="min-h-[160px]"
                      />
                      <div className="flex items-center justify-between text-xs mt-2">
                        <span className="text-muted-foreground">
                          {contentEn.length} characters
                        </span>
                        {selectedPlatforms.includes("twitter") &&
                          contentEn.length > 280 && (
                            <Badge variant="destructive" className="text-xs">
                              {text.contentEditor.twitterLimitExceeded}
                            </Badge>
                          )}
                      </div>
                    </TabsContent>

                    <TabsContent value="ar" className="mt-3">
                      <Textarea
                        name="contentAr"
                        value={contentAr}
                        onChange={(e) => setContentAr(e.target.value)}
                        placeholder="اكتب المحتوى..."
                        dir="rtl"
                        className="min-h-[160px]"
                      />
                      <div className="flex items-center justify-between text-xs mt-2">
                        <span className="text-muted-foreground">
                          {contentAr.length} حرف
                        </span>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* AI GENERATION (Disabled for now) */}
              <Card>
                <CardHeader>
                  <CardTitle>{text.aiGenerator.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    disabled
                    placeholder={text.aiGenerator.placeholder}
                  />
                  <Button disabled className="mt-2 w-full">
                    <Sparkles className="w-3 h-3 mr-2" />{" "}
                    {text.aiGenerator.generateButton}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT SIDE — PREVIEW & SCHEDULE */}
            <div className="md:sticky md:top-6 md:self-start">
              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>{text.preview.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={selectedPlatforms[0]} className="w-full">
                    <TabsList className="grid grid-cols-4">
                      {platforms.map((p) => {
                        const Icon = getPlatformIcon(p.id);
                        return (
                          <TabsTrigger
                            key={p.id}
                            value={p.id}
                            disabled={!selectedPlatforms.includes(p.id)}
                            className="text-xs"
                          >
                            <Icon className="w-3 h-3" />
                            {p.name.split(" ")[0]}
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>

                    {platforms.map((p) => (
                      <TabsContent key={p.id} value={p.id}>
                        <UnifiedPreview platform={p} />
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>

              {/* SCHEDULING */}
              <Card className="mt-3">
                <CardHeader>
                  <CardTitle>{text.schedule.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Tabs
                    value={scheduleType}
                    onValueChange={(v) => setScheduleType(v as any)}
                  >
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="now">
                        {text.schedule.publishNowTab}
                      </TabsTrigger>
                      <TabsTrigger value="later">
                        {text.schedule.scheduleLaterTab}
                      </TabsTrigger>
                    </TabsList>

                    {/* Publish now → Draft */}
                    <TabsContent value="now">
                      <p className="text-xs text-muted-foreground">
                        {text.schedule.publishNowDescription}
                      </p>
                    </TabsContent>

                    {/* Schedule later */}
                    <TabsContent value="later" className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>{text.schedule.dateLabel}</Label>
                          <Input
                            type="date"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            required={scheduleType === "later"}
                          />
                        </div>

                        <div>
                          <Label>{text.schedule.timeLabel}</Label>
                          <Input
                            type="time"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                            required={scheduleType === "later"}
                          />
                        </div>
                      </div>

                      {scheduleDate && scheduleTime && (
                        <input
                          type="hidden"
                          name="scheduledAt"
                          value={`${scheduleDate}T${scheduleTime}:00`}
                        />
                      )}
                    </TabsContent>
                  </Tabs>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isPending || selectedPlatforms.length === 0}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {text.schedule.creating}
                      </>
                    ) : scheduleType === "now" ? (
                      text.schedule.publishNowButton
                    ) : (
                      text.schedule.scheduleButton
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
