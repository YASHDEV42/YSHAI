"use client";

import type React from "react";
import { useState, useTransition, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
  Calendar,
  Save,
  Send,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  getPlatformColor,
  getPlatformIcon,
} from "@/components/icons/platforms-icons";
import { createPostAction, createDraftPostAction } from "../actions";
import type { IUser, ISocialAccount } from "@/interfaces";
import type { ICampaign } from "@/lib/campaign-helper";
import { cn } from "@/lib/utils";
import { generateAIContent } from "../ai-action";

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
  const [content, setContent] = useState("");

  const [error, setError] = useState("");

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [uploadedMedia, setUploadedMedia] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const [scheduleType, setScheduleType] = useState<"draft" | "now" | "later">(
    "draft",
  );
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const [aiPrompt, setAiPrompt] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTone, setSelectedTone] = useState("professional");

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
    if (content) progress += stepWeight;

    // Step 3: Media (20%)
    if (uploadedMedia.length > 0) progress += stepWeight;

    // Step 4: Campaign (20%)
    if (selectedCampaign) progress += stepWeight;

    // Step 5: Schedule (20%)
    if (
      scheduleType === "now" ||
      scheduleType === "draft" ||
      (scheduleDate && scheduleTime)
    )
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
          setFiles((prevFiles) => [...prevFiles, ...selected]);
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

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) {
      toast.error(
        locale === "ar"
          ? "الرجاء إدخال وصف للمحتوى"
          : "Please enter a content description",
      );
      return;
    }

    setIsGenerating(true);
    toast.loading(
      locale === "ar" ? "جاري توليد المحتوى..." : "Generating content...",
      { id: "ai-generate" },
    );

    try {
      // Get the first selected platform for optimization
      const targetPlatform =
        selectedPlatforms.length > 0
          ? platforms.find((p) => p.id === selectedPlatforms[0])?.name
          : undefined;

      const result = await generateAIContent(
        aiPrompt,
        targetPlatform,
        locale,
        selectedTone,
      );

      if (result.success && result.content) {
        // Combine content with hashtags if available
        const fullContent = result.hashtags
          ? `${result.content}\n\n${result.hashtags}`
          : result.content;

        setContent(fullContent);
        toast.success(
          locale === "ar"
            ? "تم توليد المحتوى بنجاح!"
            : "Content generated successfully!",
          {
            id: "ai-generate",
            icon: <Sparkles className="h-4 w-4" />,
          },
        );
        setAiPrompt(""); // Clear the prompt
      } else {
        throw new Error(result.error || "Failed to generate content");
      }
    } catch (error) {
      console.error("[v0] AI generation failed:", error);
      toast.error(
        locale === "ar"
          ? "فشل توليد المحتوى. حاول مرة أخرى."
          : "Failed to generate content. Please try again.",
        { id: "ai-generate" },
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // FORM SUBMISSION
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    // Attach real files for server action
    files.forEach((file) => form.append("files", file));

    startTransition(async () => {
      let result;

      if (scheduleType === "draft") {
        // Use createDraftPostAction for drafts - simpler, no platforms needed
        result = await createDraftPostAction(
          { success: false, enMessage: "", arMessage: "" },
          form,
        );
      } else {
        // Use regular createPostAction for published and scheduled posts
        result = await createPostAction(
          { success: false, enMessage: "", arMessage: "" },
          form,
        );
      }

      if (result.success) {
        setError("");

        toast.success(locale === "ar" ? result.arMessage : result.enMessage, {
          icon: <CheckCircle className="h-4 w-4" />,
          duration: 3000,
        });

        setContent("");
        setUploadedMedia([]);
        setFiles([]);
        setSelectedPlatforms([]);
        setSelectedCampaign("");
        setScheduleType("draft");
        setScheduleDate("");
        setScheduleTime("");
        setCurrentStep(1);
      } else {
        const message = locale === "ar" ? result.arMessage : result.enMessage;

        setError(message);

        toast.error(message, {
          icon: <AlertCircle className="h-4 w-4" />,
          duration: 5000,
        });
      }
    });
  };

  const UnifiedPreview = ({
    platform,
  }: {
    platform: (typeof platforms)[0];
  }) => {
    const PlatformIcon = getPlatformIcon(platform.id);
    return (
      <div
        className="border rounded-lg p-4 bg-card transition-all duration-100 hover:shadow-md"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <div className="flex gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center transition-all duration-100 hover:scale-110">
            <span className="font-semibold text-sm">Y</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              {locale === "ar" ? (
                <>
                  <PlatformIcon className="w-4 h-4" />
                  <span className="font-semibold">{platform.username}</span>
                </>
              ) : (
                <>
                  <span className="font-semibold">{platform.username}</span>
                  <PlatformIcon className="w-4 h-4" />
                </>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {platform.name}
            </span>
          </div>
        </div>

        <p className="whitespace-pre-wrap">
          {content || text.preview.noContent}
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
              isCompleted={content ? true : false}
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
                scheduleType === "now" ||
                scheduleType === "draft" ||
                (scheduleDate && scheduleTime)
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
            value={
              scheduleType === "later"
                ? "scheduled"
                : scheduleType === "now"
                  ? "published"
                  : "draft"
            }
          />

          {scheduleDate && scheduleTime && scheduleType === "later" && (
            <input
              type="hidden"
              name="scheduledAt"
              value={`${scheduleDate}T${scheduleTime}:00`}
            />
          )}

          {selectedCampaign && (
            <input type="hidden" name="campaignId" value={selectedCampaign} />
          )}

          {scheduleType !== "draft" &&
            platforms.map((p) =>
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
                        {selectedPlatforms.length}{" "}
                        {locale === "ar" ? "منصات" : "Platforms"}
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
                        {uploadedMedia.length}{" "}
                        {locale === "ar" ? "ملفات" : "Files"}
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
                    {content && (
                      <Badge variant="secondary" className="ml-auto">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {locale === "ar" ? "معبأ" : "Filled"}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* AI Content Generator Section */}
                  <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <Label className="text-sm font-semibold">
                        {text.aiGenerator?.title || "AI Content Generator"}
                      </Label>
                    </div>

                    <div className="space-y-3">
                      <Textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder={
                          text.aiGenerator?.placeholder ||
                          "Describe what you want to post..."
                        }
                        rows={3}
                        className="bg-background"
                        disabled={isGenerating}
                      />

                      <div className="flex items-center gap-2">
                        <Select
                          value={selectedTone}
                          onValueChange={setSelectedTone}
                        >
                          <SelectTrigger className="w-[180px] bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professional">
                              {locale === "ar" ? "احترافي" : "Professional"}
                            </SelectItem>
                            <SelectItem value="casual">
                              {locale === "ar" ? "عادي" : "Casual"}
                            </SelectItem>
                            <SelectItem value="friendly">
                              {locale === "ar" ? "ودود" : "Friendly"}
                            </SelectItem>
                            <SelectItem value="excited">
                              {locale === "ar" ? "متحمس" : "Excited"}
                            </SelectItem>
                            <SelectItem value="informative">
                              {locale === "ar" ? "معلوماتي" : "Informative"}
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          type="button"
                          onClick={handleGenerateAI}
                          disabled={isGenerating || !aiPrompt.trim()}
                          className="flex-1"
                          size="sm"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              {locale === "ar"
                                ? "جاري التوليد..."
                                : "Generating..."}
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              {text.aiGenerator?.generate || "Generate Content"}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Textarea
                    name="contentEn"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={text.contentEditor.placeholder}
                    rows={6}
                    className="transition-all duration-100 focus:ring-2 focus:ring-primary/20"
                  />
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
                    <TabsList className="grid grid-cols-5">
                      {platforms.map((p) => {
                        const Icon = getPlatformIcon(p.id);
                        return (
                          <TabsTrigger
                            key={p.id}
                            value={p.id}
                            disabled={!selectedPlatforms.includes(p.id)}
                            className="transition-all duration-100"
                          >
                            <Icon className="w-3 h-3" />
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
                    <Calendar className="w-4 h-4" />
                    {text.schedule.title}
                    {(scheduleType === "now" ||
                      scheduleType === "draft" ||
                      (scheduleDate && scheduleTime)) && (
                      <Badge variant="secondary" className="ml-auto">
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
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger
                        value="draft"
                        className="transition-all duration-100"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        {text.schedule.draftTab || "Draft"}
                      </TabsTrigger>
                      <TabsTrigger
                        value="now"
                        className="transition-all duration-100"
                      >
                        <Send className="w-3 h-3 mr-1" />
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

                    <TabsContent
                      value="draft"
                      className="space-y-3"
                      dir={`${locale === "ar" ? "rtl" : "ltr"}`}
                    >
                      <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                        <div className="flex items-center gap-2">
                          <Save className="w-4 h-4 text-primary" />
                          <span className="font-medium">
                            {text.schedule.draftTitle || "Save as Draft"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {text.schedule.draftDescription ||
                            "Save your work and continue editing later. Drafts won't be published to any platforms."}
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent
                      value="now"
                      className="space-y-3"
                      dir={`${locale === "ar" ? "rtl" : "ltr"}`}
                    >
                      <div className="p-4 rounded-lg bg-primary/10 space-y-2 flex items-start justify-center flex-col">
                        <div className="flex items-center gap-2">
                          <Send className="w-4 h-4 text-primary" />
                          <span className="font-medium">
                            {text.schedule.publishNowTitle}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {text.schedule.publishNowDescription}
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent
                      value="later"
                      className="space-y-3"
                      dir={`${locale === "ar" ? "rtl" : "ltr"}`}
                    >
                      <div className="space-y-3">
                        <div>
                          <Label>{text.schedule.date}</Label>
                          <input
                            type="date"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border bg-background transition-all duration-100 focus:ring-2 focus:ring-primary/20"
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </div>

                        <div>
                          <Label>{text.schedule.time}</Label>
                          <input
                            type="time"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border bg-background transition-all duration-100 focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        {scheduleDate && scheduleTime && (
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <p className="text-sm">
                              <span className="font-medium">
                                {text.schedule.scheduledFor}:{" "}
                              </span>
                              {new Date(
                                `${scheduleDate}T${scheduleTime}`,
                              ).toLocaleString(locale, {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="mt-6 w-full flex  gap-3">
                    {error && (
                      <div className="flex-1 p-3 bg-destructive/10 text-destructive rounded-lg text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      disabled={
                        isPending ||
                        !content ||
                        (scheduleType !== "draft" &&
                          selectedPlatforms.length === 0)
                      }
                      className="w-full transition-all duration-100 hover:scale-105 shadow-lg"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {locale === "ar"
                            ? "جاري المعالجة..."
                            : "Processing..."}
                        </>
                      ) : (
                        <>
                          {scheduleType === "draft" && (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              {text.schedule.saveDraftButton || "Save Draft"}
                            </>
                          )}
                          {scheduleType === "now" && (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              {text.schedule.publishNowButton}
                            </>
                          )}
                          {scheduleType === "later" && (
                            <>
                              <Calendar className="w-4 h-4 mr-2" />
                              {text.schedule.scheduleButton}
                            </>
                          )}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
