"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Clock, X, ImageIcon, Video, Loader2, Send, Save } from "lucide-react";
import Link from "next/link";

// Define text interface
export interface CreatePageText {
  header: {
    saveDraft: string;
    schedule: string;
    publishNow: string;
  };
  aiGenerator: {
    title: string;
    promptLabel: string;
    placeholder: string;
    generateButton: string;
    generating: string;
  };
  platforms: {
    title: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    tiktok: string;
  };
  contentEditor: {
    title: string;
    placeholder: string;
    characters: string;
    twitterLimitExceeded: string;
  };
  media: {
    title: string;
    uploadImage: string;
    uploadVideo: string;
  };
  schedule: {
    title: string;
    publishNowTab: string;
    scheduleLaterTab: string;
    publishNowDescription: string;
    dateLabel: string;
    timeLabel: string;
    timezoneLabel: string;
    timezones: {
      riyadh: string;
      dubai: string;
      cairo: string;
    };
  };
  preview: {
    title: string;
    noContent: string;
    captionPlaceholder: string;
    likes: string;
    comments: string;
    reposts: string;
    shares: string;
    send: string;
  };
}

interface CreatePageProps {
  text: CreatePageText;
  locale: string;
}

export default function CreatePage({ text, locale }: CreatePageProps) {
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["twitter"]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<string[]>([]);
  const [scheduleType, setScheduleType] = useState<"now" | "later">("now");
  const [aiPrompt, setAiPrompt] = useState("");

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((id) => id !== platformId) : [...prev, platformId],
    );
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    setTimeout(() => {
      setContent(
        locale === "ar"
          ? `🚀 اكتشف قوة الذكاء الاصطناعي في إدارة وسائل التواصل الاجتماعي!\n\nمع YSHAI، يمكنك:\n✨ إنشاء محتوى عربي احترافي\n📅 جدولة المنشورات تلقائياً\n📊 تحليل الأداء بذكاء\n\n#YSHAI #SocialMedia #AI`
          : `🚀 Discover the power of AI in social media management!\n\nWith YSHAI, you can:\n✨ Create professional Arabic content\n📅 Auto-schedule posts\n📊 Analyze performance intelligently\n\n#YSHAI #SocialMedia #AI`
      );
      setIsGenerating(false);
    }, 2000);
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newMedia = Array.from(files).map((file) => URL.createObjectURL(file));
      setUploadedMedia((prev) => [...prev, ...newMedia]);
    }
  };

  const removeMedia = (index: number) => {
    setUploadedMedia((prev) => prev.filter((_, i) => i !== index));
  };

  // Platform config with localized names
  const platforms = [
    { id: "twitter", name: text.platforms.twitter, icon: "𝕏", color: "text-foreground" },
    { id: "instagram", name: text.platforms.instagram, icon: "📷", color: "text-pink-500" },
    { id: "linkedin", name: text.platforms.linkedin, icon: "💼", color: "text-blue-500" },
    { id: "tiktok", name: text.platforms.tiktok, icon: "🎵", color: "text-cyan-500" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">Y</span>
            </div>
            <span className="text-xl font-bold">YSHAI</span>
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <Save className="w-4 h-4 mr-2" />
              {text.header.saveDraft}
            </Button>
            <Button variant="outline" size="sm">
              <Clock className="w-4 h-4 mr-2" />
              {text.header.schedule}
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Send className="w-4 h-4 mr-2" />
              {text.header.publishNow}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Editor */}
          <div className="space-y-6">
            {/* AI Generation */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-primary" />
                  {text.aiGenerator.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ai-prompt" className="text-sm text-muted-foreground">
                    {text.aiGenerator.promptLabel}
                  </Label>
                  <Textarea
                    id="ai-prompt"
                    placeholder={text.aiGenerator.placeholder}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="mt-2 min-h-[80px] bg-muted border-border"
                  />
                </div>
                <Button
                  onClick={handleAIGenerate}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {text.aiGenerator.generating}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      {text.aiGenerator.generateButton}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Platform Selection */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">{text.platforms.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {platforms.map((platform) => (
                    <label
                      key={platform.id}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedPlatforms.includes(platform.id)
                        ? "border-primary bg-primary/10"
                        : "border-border bg-muted hover:border-muted-foreground/50"
                        }`}
                    >
                      <Checkbox
                        checked={selectedPlatforms.includes(platform.id)}
                        onCheckedChange={() => handlePlatformToggle(platform.id)}
                      />
                      <span className="text-2xl">{platform.icon}</span>
                      <span className="text-sm font-medium">{platform.name}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">{text.contentEditor.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder={text.contentEditor.placeholder}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px] bg-muted border-border text-base"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{text.contentEditor.characters.replace("{count}", content.length.toString())}</span>
                  <span>
                    {selectedPlatforms.includes("twitter") && content.length > 280 && (
                      <Badge variant="destructive">{text.contentEditor.twitterLimitExceeded}</Badge>
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Media Upload */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">{text.media.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors bg-muted">
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{text.media.uploadImage}</span>
                    <input type="file" accept="image/*" multiple onChange={handleMediaUpload} className="hidden" />
                  </label>
                  <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors bg-muted">
                    <Video className="w-6 h-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{text.media.uploadVideo}</span>
                    <input type="file" accept="video/*" onChange={handleMediaUpload} className="hidden" />
                  </label>
                </div>

                {uploadedMedia.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {uploadedMedia.map((media, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={media || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeMedia(index)}
                          className="absolute top-1 right-1 p-1 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Scheduling */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">{text.schedule.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={scheduleType} onValueChange={(v) => setScheduleType(v as "now" | "later")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="now">{text.schedule.publishNowTab}</TabsTrigger>
                    <TabsTrigger value="later">{text.schedule.scheduleLaterTab}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="now" className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {text.schedule.publishNowDescription}
                    </p>
                  </TabsContent>
                  <TabsContent value="later" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="schedule-date" className="text-sm">
                          {text.schedule.dateLabel}
                        </Label>
                        <Input id="schedule-date" type="date" className="mt-2 bg-muted border-border" />
                      </div>
                      <div>
                        <Label htmlFor="schedule-time" className="text-sm">
                          {text.schedule.timeLabel}
                        </Label>
                        <Input id="schedule-time" type="time" className="mt-2 bg-muted border-border" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="timezone" className="text-sm">
                        {text.schedule.timezoneLabel}
                      </Label>
                      <Select defaultValue="riyadh">
                        <SelectTrigger id="timezone" className="mt-2 bg-muted border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="riyadh">{text.schedule.timezones.riyadh}</SelectItem>
                          <SelectItem value="dubai">{text.schedule.timezones.dubai}</SelectItem>
                          <SelectItem value="cairo">{text.schedule.timezones.cairo}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Preview */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">{text.preview.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="twitter" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    {platforms.map((platform) => (
                      <TabsTrigger
                        key={platform.id}
                        value={platform.id}
                        disabled={!selectedPlatforms.includes(platform.id)}
                        className="text-xs"
                      >
                        <span className="mr-1">{platform.icon}</span>
                        {platform.name.split(" ")[0]}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* Twitter Preview */}
                  <TabsContent value="twitter" className="space-y-4">
                    <div className="bg-background border border-border rounded-xl p-4">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <span className="text-primary-foreground font-bold">Y</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold">YSHAI</span>
                            <span className="text-muted-foreground text-sm">@yshai</span>
                            <span className="text-muted-foreground text-sm">· now</span>
                          </div>
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">
                            {content || text.preview.noContent}
                          </p>
                          {uploadedMedia.length > 0 && (
                            <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
                              {uploadedMedia.slice(0, 4).map((media, index) => (
                                <img
                                  key={index}
                                  src={media || "/placeholder.svg"}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-32 object-cover"
                                />
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-6 mt-3 text-muted-foreground">
                            <button className="hover:text-primary transition-colors">💬 0</button>
                            <button className="hover:text-green-500 transition-colors">🔄 0</button>
                            <button className="hover:text-red-500 transition-colors">❤️ 0</button>
                            <button className="hover:text-primary transition-colors">📊 0</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Instagram Preview */}
                  <TabsContent value="instagram" className="space-y-4">
                    <div className="bg-background border border-border rounded-xl overflow-hidden">
                      <div className="p-3 flex items-center gap-3 border-b border-border">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">Y</span>
                        </div>
                        <span className="font-semibold text-sm">yshai</span>
                      </div>
                      {uploadedMedia.length > 0 && (
                        <img
                          src={uploadedMedia[0] || "/placeholder.svg"}
                          alt="Instagram preview"
                          className="w-full aspect-square object-cover"
                        />
                      )}
                      <div className="p-3">
                        <div className="flex items-center gap-4 mb-2">
                          <button>❤️</button>
                          <button>💬</button>
                          <button>📤</button>
                        </div>
                        <p className="text-sm">
                          <span className="font-semibold">yshai</span> {content || text.preview.captionPlaceholder}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* LinkedIn Preview */}
                  <TabsContent value="linkedin" className="space-y-4">
                    <div className="bg-background border border-border rounded-xl p-4">
                      <div className="flex gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-white font-bold">Y</span>
                        </div>
                        <div>
                          <div className="font-semibold">YSHAI</div>
                          <div className="text-xs text-muted-foreground">AI-Powered Social Media Scheduler</div>
                          <div className="text-xs text-muted-foreground">now</div>
                        </div>
                      </div>
                      <p className="text-sm whitespace-pre-wrap mb-3">
                        {content || text.preview.noContent}
                      </p>
                      {uploadedMedia.length > 0 && (
                        <img
                          src={uploadedMedia[0] || "/placeholder.svg"}
                          alt="LinkedIn preview"
                          className="w-full rounded-lg"
                        />
                      )}
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border text-sm text-muted-foreground">
                        <button>{text.preview.likes}</button>
                        <button>{text.preview.comments}</button>
                        <button>{text.preview.reposts}</button>
                        <button>{text.preview.send}</button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* TikTok Preview */}
                  <TabsContent value="tiktok" className="space-y-4">
                    <div className="bg-background border border-border rounded-xl p-4">
                      <div className="aspect-[9/16] bg-gradient-to-br from-cyan-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                        {uploadedMedia.length > 0 ? (
                          <img
                            src={uploadedMedia[0] || "/placeholder.svg"}
                            alt="TikTok preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-center text-muted-foreground">
                            <Video className="w-12 h-12 mx-auto mb-2" />
                            <p className="text-sm">Video preview</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-pink-500 flex items-center justify-center">
                            <span className="text-white font-bold text-xs">Y</span>
                          </div>
                          <span className="font-semibold text-sm">@yshai</span>
                        </div>
                        <p className="text-sm">{content || text.preview.captionPlaceholder}</p>
                      </div>
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
