"use client";

import type React from "react";
import { useState } from "react";
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
import { Sparkles, X, ImageIcon, Video } from "lucide-react";
import {
  getPlatformColor,
  getPlatformIcon,
} from "@/components/icons/platforms-icons";

export default function CreatePage({
  text,
  locale,
}: {
  text: any;
  locale: string;
}) {
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "instagram",
  ]);
  const [uploadedMedia, setUploadedMedia] = useState<string[]>([]);
  const [scheduleType, setScheduleType] = useState<"now" | "later">("now");
  const [aiPrompt, setAiPrompt] = useState("");

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

  const platforms = [
    {
      id: "instagram",
      name: text.platforms.instagram,
    },
    {
      id: "twitter",
      name: text.platforms.twitter,
    },
    {
      id: "linkedin",
      name: text.platforms.linkedin,
    },
    {
      id: "tiktok",
      name: text.platforms.tiktok,
    },
  ];

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
          {content || text.preview.noContent}
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
                        src={media || "/placeholder.svg"}
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

        <div className="flex items-center gap-6 mt-4 pt-3 border-t text-xs text-muted-foreground">
          <button className="hover:text-foreground transition-colors">
            ❤️ 0
          </button>
          <button className="hover:text-foreground transition-colors">
            💬 0
          </button>
          <button className="hover:text-foreground transition-colors">
            🔄 0
          </button>
          <button className="hover:text-foreground transition-colors">
            📤
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* Left Side - Editor */}
          <div className="space-y-4">
            {/* Platform Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {text.platforms.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((platform) => {
                    const PlatformIcon = getPlatformIcon(platform.id);
                    const isSelected = selectedPlatforms.includes(platform.id);

                    return (
                      <Button
                        key={platform.id}
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

            {/* Media Upload */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{text.media.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-lg border-2 border-dashed hover:border-primary/50 cursor-pointer transition-colors">
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {text.media.uploadImage}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMediaUpload}
                      className="hidden"
                    />
                  </label>
                  <label className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-lg border-2 border-dashed hover:border-primary/50 cursor-pointer transition-colors">
                    <Video className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {text.media.uploadVideo}
                    </span>
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
                          src={media || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeMedia(index)}
                          className="absolute top-0.5 right-0.5 p-0.5 bg-background/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Content Editor */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {text.contentEditor.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder={text.contentEditor.placeholder}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[160px] text-sm"
                />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {text.contentEditor.characters.replace(
                      "{count}",
                      content.length.toString(),
                    )}
                  </span>
                  {selectedPlatforms.includes("twitter") &&
                    content.length > 280 && (
                      <Badge variant="destructive" className="text-xs">
                        {text.contentEditor.twitterLimitExceeded}
                      </Badge>
                    )}
                </div>
              </CardContent>
            </Card>

            {/* AI Generation */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="w-4 h-4 text-primary" />
                  {text.aiGenerator.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label
                    htmlFor="ai-prompt"
                    className="text-xs text-muted-foreground"
                  >
                    {text.aiGenerator.promptLabel}
                  </Label>
                  <Textarea
                    id="ai-prompt"
                    placeholder={text.aiGenerator.placeholder}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="mt-1.5 min-h-[70px] text-sm"
                  />
                </div>
                <Button
                  size="sm"
                  className="w-full cursor-not-allowed"
                  disabled
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  {text.aiGenerator.generateButton}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Preview */}
          <div className="md:sticky md:top-6 md:self-start">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {text.preview.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue={selectedPlatforms[0] || "instagram"}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-4 h-9">
                    {platforms.map((platform) => {
                      const PlatformIcon = getPlatformIcon(platform.id);
                      return (
                        <TabsTrigger
                          key={platform.id}
                          value={platform.id}
                          disabled={!selectedPlatforms.includes(platform.id)}
                          className="text-xs gap-1"
                        >
                          <PlatformIcon className="w-3 h-3" />
                          <span className="hidden sm:inline">
                            {platform.name.split(" ")[0]}
                          </span>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  {platforms.map((platform) => (
                    <TabsContent
                      key={platform.id}
                      value={platform.id}
                      className="mt-4"
                    >
                      <UnifiedPreview platform={platform} />
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
            {/* Scheduling */}
            <Card className="mt-3">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {text.schedule.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Tabs
                  value={scheduleType}
                  onValueChange={(v) => setScheduleType(v as "now" | "later")}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="now" className="text-xs">
                      {text.schedule.publishNowTab}
                    </TabsTrigger>
                    <TabsTrigger value="later" className="text-xs">
                      {text.schedule.scheduleLaterTab}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="now" className="space-y-3 mt-3">
                    <p className="text-xs text-muted-foreground">
                      {text.schedule.publishNowDescription}
                    </p>
                  </TabsContent>
                  <TabsContent value="later" className="space-y-3 mt-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="schedule-date" className="text-xs">
                          {text.schedule.dateLabel}
                        </Label>
                        <Input
                          id="schedule-date"
                          type="date"
                          className="mt-1.5 h-9 text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="schedule-time" className="text-xs">
                          {text.schedule.timeLabel}
                        </Label>
                        <Input
                          id="schedule-time"
                          type="time"
                          className="mt-1.5 h-9 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="timezone" className="text-xs">
                        {text.schedule.timezoneLabel}
                      </Label>
                      <Select defaultValue="riyadh">
                        <SelectTrigger
                          id="timezone"
                          className="mt-1.5 h-9 text-sm"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="riyadh">
                            {text.schedule.timezones.riyadh}
                          </SelectItem>
                          <SelectItem value="dubai">
                            {text.schedule.timezones.dubai}
                          </SelectItem>
                          <SelectItem value="cairo">
                            {text.schedule.timezones.cairo}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
