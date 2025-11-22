"use client";

import type React from "react";
import { useState, useTransition, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  X,
  ImageIcon,
  Video,
  Loader2,
  FolderOpen,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Clock,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import {
  getPlatformColor,
  getPlatformIcon,
} from "@/components/icons/platforms-icons";
import { createPostAction } from "../actions";
import type { IUser, ISocialAccount } from "@/interfaces";
import type { ICampaign } from "@/lib/campaign-helper";
import { cn } from "@/lib/utils";

// Step indicator component
const StepIndicator = ({
  step,
  title,
  isActive,
  isCompleted,
  onClick,
}: {
  step: number;
  title: string;
  isActive: boolean;
  isCompleted: any;
  onClick: () => void;
}) => {
  return (
    <div
      className={cn(
        "flex items-center cursor-pointer transition-all duration-100",
        isActive ? "scale-105" : "",
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-100",
          isCompleted
            ? "border-primary bg-primary text-primary-foreground"
            : isActive
              ? "border-primary text-primary"
              : "border-muted-foreground text-muted-foreground",
        )}
      >
        {isCompleted ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <span className="text-sm font-medium">{step}</span>
        )}
      </div>
      <span
        className={cn(
          "mx-2 text-sm font-medium transition-colors",
          isActive || isCompleted ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {title}
      </span>
    </div>
  );
};

export default function CreatePage({
  text,
  locale,
  user,
  accounts,
  campaigns,
}: {
  text: any;
  locale: string;
  user: IUser;
  accounts: ISocialAccount[];
  campaigns: ICampaign[];
}) {
  // STATE
  const [contentAr, setContentAr] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [contentTab, setContentTab] = useState<"ar" | "en">(
    locale === "ar" ? "ar" : "en",
  );

  const [error, setError] = useState("");

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [uploadedMedia, setUploadedMedia] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const [scheduleType, setScheduleType] = useState<"now" | "later">("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const [aiPrompt, setAiPrompt] = useState("");
  const [isPending, startTransition] = useTransition();

  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  // PLATFORM LIST (from backend)
  const platforms = accounts.map((acc) => ({
    id: acc.provider,
    name: text.platforms[acc.provider],
    socialAccountId: acc.id,
    username: acc.username,
  }));

  // PROGRESS CALCULATION
  const calculateProgress = () => {
    let progress = 0;
    const steps = 5; // Total number of steps
    const stepWeight = 100 / steps;

    // Step 1: Platform selection (20%)
    if (selectedPlatforms.length > 0) progress += stepWeight;

    // Step 2: Content (20%)
    if (contentEn || contentAr) progress += stepWeight;

    // Step 3: Media (20%)
    if (uploadedMedia.length > 0) progress += stepWeight;

    // Step 4: Campaign (20%)
    if (selectedCampaign) progress += stepWeight;

    // Step 5: Schedule (20%)
    if (scheduleType === "now" || (scheduleDate && scheduleTime))
      progress += stepWeight;

    return progress;
  };

  const progress = calculateProgress();

  // EFFECTS
  useEffect(() => {
    toast.info(
      locale === "ar"
        ? "مرحباً! ابدأ بإنشاء منشور جديد"
        : "Welcome! Start creating a new post",
      {
        icon: <Info className="h-4 w-4" />,
        duration: 3000,
      },
    );
  }, [locale]);

  // HANDLERS
  const handlePlatformToggle = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );

    // Show toast when first platform is selected
    if (selectedPlatforms.length === 0) {
      toast.success(
        locale === "ar"
          ? "تم اختيار المنصة بنجاح!"
          : "Platform selected successfully!",
        {
          icon: <CheckCircle className="h-4 w-4" />,
          duration: 2000,
        },
      );
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files); // Type: File[]

    // Simulate upload progress
    setIsUploading(true);
    setUploadProgress(0);

    // Show upload started toast
    toast.loading(
      locale === "ar" ? "جاري رفع الوسائط..." : "Uploading media...",
      {
        id: "upload-progress",
      },
    );

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);

          // Store real Files for upload
          setFiles((prevFiles) => [...prevFiles, ...selected]);

          // Store preview URLs
          setUploadedMedia((prev) => [
            ...prev,
            ...selected.map((file) => URL.createObjectURL(file)),
          ]);

          // Show success toast
          toast.success(
            locale === "ar"
              ? "تم رفع الوسائط بنجاح!"
              : "Media uploaded successfully!",
            {
              id: "upload-progress",
              icon: <CheckCircle className="h-4 w-4" />,
              duration: 2000,
            },
          );

          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const removeMedia = (index: number) => {
    setUploadedMedia((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index)); // Remove actual file too

    toast(locale === "ar" ? text.media.mediaRemoved : text.media.mediaRemoved, {
      icon: <X className="h-4 w-4" />,
      duration: 1500,
    });
  };

  const navigateToStep = (step: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(step);
      setIsAnimating(false);
    }, 300);
  };

  // FORM SUBMISSION
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

      if (result.success) {
        setError("");

        toast.success(locale === "ar" ? result.arMessage : result.enMessage, {
          icon: <CheckCircle className="h-4 w-4" />,
          duration: 3000,
        });

        // Reset form
        setContentAr("");
        setContentEn("");
        setUploadedMedia([]);
        setFiles([]);
        setSelectedPlatforms([]);
        setSelectedCampaign("");
        setCurrentStep(1);
      } else {
        const message = locale === "ar" ? result.arMessage : result.enMessage;

        setError(message); // SET ERROR STATE

        toast.error(message, {
          icon: <AlertCircle className="h-4 w-4" />,
          duration: 5000,
        });
      }
    });
  };

  // PREVIEW COMPONENT
  const currentContent = contentTab === "ar" ? contentAr : contentEn;

  const UnifiedPreview = ({
    platform,
  }: {
    platform: (typeof platforms)[0];
  }) => {
    const PlatformIcon = getPlatformIcon(platform.id);
    return (
      <div className="border rounded-lg p-4 bg-card transition-all duration-100 hover:shadow-md">
        <div className="flex gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center transition-all duration-100 hover:scale-110">
            <span className="font-semibold text-sm">Y</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{platform.username}</span>
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
                src={uploadedMedia[0] || "/placeholder.svg"}
                alt="Post media"
                className="w-full rounded-lg object-cover max-h-80 transition-all duration-100 hover:scale-105"
              />
            ) : (
              <Carousel className="w-full">
                <CarouselContent>
                  {uploadedMedia.map((m, i) => (
                    <CarouselItem key={i}>
                      <img
                        src={m || "/placeholder.svg"}
                        alt={`Post media ${i + 1}`}
                        className="w-full rounded-lg object-cover max-h-80 transition-all duration-100 hover:scale-105"
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

  // RENDER
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <h1 className="text-2xl font-bold">
              {text.createPost || "Create Post"}
            </h1>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progress)}% {text.complete || "Complete"}
            </span>
          </div>
          <Progress
            value={progress}
            className="h-2"
            dir={locale === "ar" ? "rtl" : "ltr"}
          />

          {/* Step Indicators */}
          <div className="flex justify-between mt-6">
            <StepIndicator
              step={1}
              title={text.platforms.title || "Platforms"}
              isActive={currentStep === 1}
              isCompleted={selectedPlatforms.length > 0}
              onClick={() => navigateToStep(1)}
            />
            <StepIndicator
              step={2}
              title={text.campaigns.title || "Campaign"}
              isActive={currentStep === 2}
              isCompleted={contentEn || contentAr ? true : false}
              onClick={() => navigateToStep(2)}
            />
            <StepIndicator
              step={3}
              title={text.media.title || "Media"}
              isActive={currentStep === 3}
              isCompleted={uploadedMedia.length > 0}
              onClick={() => navigateToStep(3)}
            />
            <StepIndicator
              step={4}
              title={text.contentEditor.title || "Content"}
              isActive={currentStep === 4}
              isCompleted={selectedCampaign ? true : false}
              onClick={() => navigateToStep(4)}
            />
            <StepIndicator
              step={5}
              title={text.schedule.title || "Schedule"}
              isActive={currentStep === 5}
              isCompleted={
                scheduleType === "now" || (scheduleDate && scheduleTime)
              }
              onClick={() => navigateToStep(5)}
            />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          ref={formRef}
        >
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

          {selectedCampaign && (
            <input type="hidden" name="campaignId" value={selectedCampaign} />
          )}

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
            <div
              className={cn(
                "space-y-4 transition-all duration-100",
                isAnimating
                  ? "opacity-0 translate-x-4"
                  : "opacity-100 translate-x-0",
              )}
            >
              {/* PLATFORM SELECTOR */}
              <Card
                className={cn(
                  "transition-all duration-100",
                  currentStep === 1
                    ? "ring-2 ring-primary shadow-lg"
                    : "hover:shadow-md",
                )}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {text.platforms.title}
                    {selectedPlatforms.length > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {selectedPlatforms.length} selected
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {platforms.map((p, index) => {
                      const Icon = getPlatformIcon(p.id);
                      const isSelected = selectedPlatforms.includes(p.id);
                      return (
                        <Button
                          key={p.id}
                          type="button"
                          onClick={() => handlePlatformToggle(p.id)}
                          variant={isSelected ? "default" : "outline"}
                          className={cn(
                            isSelected ? getPlatformColor(p.id) : "",
                            "transition-all duration-100 hover:scale-105",
                            isSelected ? "shadow-md" : "",
                          )}
                          size="sm"
                          style={{
                            animationDelay: `${index * 50}ms`,
                            animation: "fadeIn 0.5s ease-out forwards",
                          }}
                        >
                          <Icon className="w-3 h-3 mr-1" />
                          {p.username}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* CAMPAIGN SELECTOR */}
              <Card
                className={cn(
                  "transition-all duration-100",
                  currentStep === 2
                    ? "ring-2 ring-primary shadow-lg"
                    : "hover:shadow-md",
                )}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" />
                    {text.campaigns.title}
                    {selectedCampaign && (
                      <Badge variant="secondary" className="ml-auto">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Selected
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={selectedCampaign}
                    onValueChange={setSelectedCampaign}
                  >
                    <SelectTrigger className="transition-all duration-100 focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder={text.campaigns.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {campaigns.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          {text.campaigns.noCampaigns}
                        </div>
                      ) : (
                        campaigns
                          .filter((c) => c.status == "active")
                          .map((campaign) => (
                            <SelectItem
                              key={campaign.id}
                              value={campaign.id.toString()}
                            >
                              {campaign.name}
                            </SelectItem>
                          ))
                      )}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* MEDIA UPLOAD */}
              <Card
                className={cn(
                  "transition-all duration-100",
                  currentStep === 3
                    ? "ring-2 ring-primary shadow-lg"
                    : "hover:shadow-md",
                )}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {text.media.title}
                    {uploadedMedia.length > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {uploadedMedia.length} files
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <label className="border-dashed border-2 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-all duration-100 hover:bg-primary/5">
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

                    <label className="border-dashed border-2 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-all duration-100 hover:bg-primary/5">
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

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress
                        value={uploadProgress}
                        className="h-2"
                        dir={locale === "ar" ? "rtl" : "ltr"}
                      />
                    </div>
                  )}

                  {uploadedMedia.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {uploadedMedia.map((media, i) => (
                        <div
                          key={i}
                          className="relative group overflow-hidden rounded-lg transition-all duration-100 hover:scale-105"
                          style={{
                            animationDelay: `${i * 100}ms`,
                            animation: "fadeIn 0.5s ease-out forwards",
                          }}
                        >
                          <img
                            src={media || "/placeholder.svg"}
                            alt={`Upload ${i + 1}`}
                            className="h-20 w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeMedia(i)}
                            className="absolute top-1 right-1 bg-background/90 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
              <Card
                className={cn(
                  "transition-all duration-100",
                  currentStep === 4
                    ? "ring-2 ring-primary shadow-lg"
                    : "hover:shadow-md",
                )}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {text.contentEditor.title}
                    {(contentEn || contentAr) && (
                      <Badge variant="secondary" className="ml-auto">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Filled
                      </Badge>
                    )}
                  </CardTitle>
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
                        rows={6}
                        className="transition-all duration-100 focus:ring-2 focus:ring-primary/20"
                      />
                    </TabsContent>

                    <TabsContent value="ar">
                      <Textarea
                        name="contentAr"
                        dir="rtl"
                        value={contentAr}
                        onChange={(e) => setContentAr(e.target.value)}
                        placeholder="اكتب المحتوى هنا..."
                        rows={6}
                        className="transition-all duration-100 focus:ring-2 focus:ring-primary/20"
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT SIDE */}
            <div
              className={cn(
                "space-y-4 transition-all duration-100",
                isAnimating
                  ? "opacity-0 translate-x-4"
                  : "opacity-100 translate-x-0",
              )}
            >
              {/* PREVIEW */}
              <Card className="transition-all duration-100 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {text.preview.title}
                  </CardTitle>
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
                            className="transition-all duration-100"
                          >
                            <Icon className="w-3 h-3 mr-1" />
                            {p.username}
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
              <Card
                className={cn(
                  "transition-all duration-100",
                  currentStep === 5
                    ? "ring-2 ring-primary shadow-lg"
                    : "hover:shadow-md",
                )}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {text.schedule.title}
                    {(scheduleType === "now" ||
                      (scheduleDate && scheduleTime)) && (
                      <Badge
                        variant="secondary"
                        className="ml-auto text-primary"
                      >
                        <CheckCircle className="w-3 h-3 mr-1 text-primary" />
                        {locale === "ar" ? "محدد" : "Set"}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs
                    value={scheduleType}
                    onValueChange={(v) => setScheduleType(v as any)}
                  >
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger
                        value="now"
                        className="transition-all duration-100"
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        {text.schedule.publishNowTab}
                      </TabsTrigger>
                      <TabsTrigger
                        value="later"
                        className="transition-all duration-100"
                      >
                        <Calendar className="w-3 h-3 mr-1" />
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
                            className="transition-all duration-100 focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div>
                          <Label>{text.schedule.timeLabel}</Label>
                          <Input
                            type="time"
                            required
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                            className="transition-all duration-100 focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  {error && (
                    <p className="text-sm text-destructive mt-2 animate-pulse">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={isPending || selectedPlatforms.length === 0}
                    className="w-full mt-4 transition-all duration-100 hover:scale-[1.02]"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        {text.schedule.creating}
                      </>
                    ) : scheduleType === "now" ? (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        {text.schedule.publishNowButton}
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4 mr-2" />
                        {text.schedule.scheduleButton}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
