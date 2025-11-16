"use client";

import type React from "react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  user: IUser;
  accounts: ISocialAccount[];
}) {
  // ---------------------------------------------------------
  // STATE
  // ---------------------------------------------------------
  const [contentAr, setContentAr] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [contentTab, setContentTab] = useState<"ar" | "en">("en");

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [uploadedMedia, setUploadedMedia] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]); // 👈 IMPORTANT: real files

  const [scheduleType, setScheduleType] = useState<"now" | "later">("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const [aiPrompt, setAiPrompt] = useState("");
  const [isPending, startTransition] = useTransition();

  // ---------------------------------------------------------
  // PLATFORM LIST (from backend)
  // ---------------------------------------------------------
  const platforms = accounts.map((acc) => ({
    id: acc.provider,
    name: text.platforms[acc.provider],
    socialAccountId: acc.id,
  }));

  // ---------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------
  const handlePlatformToggle = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files); // Type: File[]

    // Store real Files for upload
    setFiles((prev) => [...prev, ...selected]);

    // Store preview URLs
    setUploadedMedia((prev) => [
      ...prev,
      ...selected.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removeMedia = (index: number) => {
    setUploadedMedia((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index)); // Remove actual file too
  };

  // ---------------------------------------------------------
  // FORM SUBMISSION
  // ---------------------------------------------------------
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    // Attach real files for server action
    files.forEach((file) => form.append("files", file));

    startTransition(async () => {
      const result = await createPostAction(
        { success: false, enMessage: "", arMessage: "" },
        form,
      );
    });
  };

  // ---------------------------------------------------------
  // PREVIEW COMPONENT
  // ---------------------------------------------------------
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
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="font-semibold text-sm">Y</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">YSHAI</span>
              <PlatformIcon className="w-4 h-4" />
            </div>
            <span className="text-xs text-muted-foreground">
              {platform.name}
            </span>
          </div>
        </div>

        <p className="whitespace-pre-wrap">
          {currentContent || text.preview.noContent}
        </p>

        {uploadedMedia.length > 0 && (
          <div className="mt-3">
            {uploadedMedia.length === 1 ? (
              <img
                src={uploadedMedia[0]}
                className="w-full rounded-lg object-cover max-h-80"
              />
            ) : (
              <Carousel className="w-full">
                <CarouselContent>
                  {uploadedMedia.map((m, i) => (
                    <CarouselItem key={i}>
                      <img
                        src={m}
                        className="w-full rounded-lg object-cover max-h-80"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
          </div>
        )}
      </div>
    );
  };

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* SAFE HIDDEN VALUES */}
          <input type="hidden" name="authorId" value={user.id} />
          <input
            type="hidden"
            name="status"
            value={scheduleType === "later" ? "scheduled" : "draft"}
          />

          {scheduleDate && scheduleTime && (
            <input
              type="hidden"
              name="scheduledAt"
              value={`${scheduleDate}T${scheduleTime}:00`}
            />
          )}

          {/* SELECTED SOCIAL ACCOUNTS */}
          {platforms.map((p) =>
            selectedPlatforms.includes(p.id) ? (
              <input
                key={p.id}
                type="hidden"
                name="socialAccountIds"
                value={p.socialAccountId}
              />
            ) : null,
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* LEFT SIDE */}
            <div className="space-y-4">
              {/* PLATFORM SELECTOR */}
              <Card>
                <CardHeader>
                  <CardTitle>{text.platforms.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {platforms.map((p) => {
                      const Icon = getPlatformIcon(p.id);
                      const isSelected = selectedPlatforms.includes(p.id);
                      return (
                        <Button
                          key={p.id}
                          type="button"
                          onClick={() => handlePlatformToggle(p.id)}
                          variant={isSelected ? "default" : "outline"}
                          className={isSelected ? getPlatformColor(p.id) : ""}
                          size="sm"
                        >
                          <Icon className="w-3 h-3 mr-1" />
                          {p.name}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* MEDIA UPLOAD */}
              <Card>
                <CardHeader>
                  <CardTitle>{text.media.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <label className="border-dashed border-2 rounded-lg p-4 text-center cursor-pointer">
                      <ImageIcon className="w-5 h-5 mx-auto text-muted-foreground" />
                      <span className="text-xs">{text.media.uploadImage}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleMediaUpload}
                      />
                    </label>

                    <label className="border-dashed border-2 rounded-lg p-4 text-center cursor-pointer">
                      <Video className="w-5 h-5 mx-auto text-muted-foreground" />
                      <span className="text-xs">{text.media.uploadVideo}</span>
                      <input
                        type="file"
                        accept="video/*"
                        multiple
                        className="hidden"
                        onChange={handleMediaUpload}
                      />
                    </label>
                  </div>

                  {uploadedMedia.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {uploadedMedia.map((media, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={media}
                            className="h-20 w-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeMedia(i)}
                            className="absolute top-1 right-1 bg-background/90 p-1 rounded-full opacity-0 group-hover:opacity-100"
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
                <CardContent>
                  <Tabs
                    value={contentTab}
                    onValueChange={(v) => setContentTab(v as any)}
                  >
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="ar">العربية</TabsTrigger>
                    </TabsList>

                    <TabsContent value="en">
                      <Textarea
                        name="contentEn"
                        value={contentEn}
                        onChange={(e) => setContentEn(e.target.value)}
                        placeholder={text.contentEditor.placeholder}
                      />
                    </TabsContent>

                    <TabsContent value="ar">
                      <Textarea
                        name="contentAr"
                        dir="rtl"
                        value={contentAr}
                        onChange={(e) => setContentAr(e.target.value)}
                        placeholder="اكتب المحتوى هنا..."
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT SIDE — PREVIEW + SCHEDULE */}
            <div className="space-y-4">
              {/* PREVIEW */}
              <Card>
                <CardHeader>
                  <CardTitle>{text.preview.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={platforms[0]?.id}>
                    <TabsList className="grid grid-cols-4">
                      {platforms.map((p) => {
                        const Icon = getPlatformIcon(p.id);
                        return (
                          <TabsTrigger
                            key={p.id}
                            value={p.id}
                            disabled={!selectedPlatforms.includes(p.id)}
                          >
                            <Icon className="w-3 h-3 mr-1" />
                            {p.name}
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

              {/* SCHEDULE SECTION */}
              <Card>
                <CardHeader>
                  <CardTitle>{text.schedule.title}</CardTitle>
                </CardHeader>
                <CardContent>
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

                    <TabsContent value="now">
                      <p className="text-xs text-muted-foreground">
                        {text.schedule.publishNowDescription}
                      </p>
                    </TabsContent>

                    <TabsContent value="later" className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>{text.schedule.dateLabel}</Label>
                          <Input
                            type="date"
                            required
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>{text.schedule.timeLabel}</Label>
                          <Input
                            type="time"
                            required
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <Button
                    type="submit"
                    disabled={isPending || selectedPlatforms.length === 0}
                    className="w-full mt-4"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
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
