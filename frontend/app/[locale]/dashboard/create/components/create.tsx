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

/* -------------------------------------------------------------------------- */
/*                                    STEP UI                                 */
/* -------------------------------------------------------------------------- */

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
  isCompleted: boolean | string;
  onClick: () => void;
}) => (
  <div
    className={cn(
      "flex items-center cursor-pointer transition-all duration-150",
      isActive && "scale-105",
    )}
    onClick={onClick}
  >
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
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
        "mx-2 text-sm font-medium",
        isActive || isCompleted ? "text-foreground" : "text-muted-foreground",
      )}
    >
      {title}
    </span>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

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
  /* ----------------------------- STATE MANAGMENT ---------------------------- */

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

  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  /* --------------------------------- Data --------------------------------- */

  const platforms = accounts.map((a) => ({
    id: a.provider,
    name: text.platforms[a.provider],
    username: a.username,
    socialAccountId: a.id,
  }));

  /* ------------------------------- PROGRESS -------------------------------- */

  const calculateProgress = () => {
    const steps = 5;
    const weight = 100 / steps;
    let progress = 0;

    if (selectedPlatforms.length > 0) progress += weight;
    if (selectedCampaign) progress += weight;
    if (uploadedMedia.length > 0) progress += weight;
    if (contentAr || contentEn) progress += weight;
    if (scheduleType === "now" || (scheduleDate && scheduleTime))
      progress += weight;

    return progress;
  };

  /* -------------------------------- Effects -------------------------------- */

  useEffect(() => {
    toast.info(
      locale === "ar"
        ? "مرحباً! ابدأ بإنشاء منشور جديد"
        : "Welcome! Start creating a new post",
      { icon: <Info className="h-4 w-4" /> },
    );
  }, [locale]);

  /* ------------------------------- Navigation ------------------------------- */

  const navigateToStep = (step: number) => {
    const stepTitles = [
      text.platforms.title,
      text.campaigns.title,
      text.media.title,
      text.contentEditor.title,
      text.schedule.title,
    ];

    toast.info(
      locale === "ar"
        ? `تم الانتقال إلى: ${stepTitles[step - 1]}`
        : `Switched to: ${stepTitles[step - 1]}`,
      { icon: <Info className="h-4 w-4" /> },
    );

    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(step);
      setIsAnimating(false);
    }, 250);
  };

  /* ----------------------- PLATFORM SELECTOR HANDLER ----------------------- */

  const handlePlatformToggle = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );

    toast.success(
      locale === "ar" ? "تم اختيار المنصة" : "Platform selection updated",
      { icon: <CheckCircle className="h-4 w-4" /> },
    );
  };

  /* ------------------------------ MEDIA UPLOAD ------------------------------ */

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files);
    setIsUploading(true);
    setUploadProgress(0);

    toast.loading(
      locale === "ar" ? "جاري رفع الوسائط..." : "Uploading media...",
      { id: "upload-progress" },
    );

    const interval = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsUploading(false);

          setFiles((prev) => [...prev, ...selected]);
          setUploadedMedia((prev) => [
            ...prev,
            ...selected.map((f) => URL.createObjectURL(f)),
          ]);

          toast.success(
            locale === "ar" ? "تم رفع الوسائط!" : "Upload complete!",
            {
              id: "upload-progress",
              icon: <CheckCircle className="h-4 w-4" />,
            },
          );

          return 100;
        }
        return p + 12;
      });
    }, 90);
  };

  const removeMedia = (i: number) => {
    setUploadedMedia((prev) => prev.filter((_, idx) => idx !== i));
    setFiles((prev) => prev.filter((_, idx) => idx !== i));

    toast(locale === "ar" ? text.media.mediaRemoved : text.media.mediaRemoved, {
      icon: <X className="h-4 w-4" />,
    });
  };

  /* ------------------------------ FORM SUBMIT ------------------------------ */

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    files.forEach((file) => form.append("files", file));

    startTransition(async () => {
      const result = await createPostAction(
        { success: false, enMessage: "", arMessage: "" },
        form,
      );

      if (result.success) {
        toast.success(locale === "ar" ? result.arMessage : result.enMessage, {
          icon: <CheckCircle className="h-4 w-4" />,
        });

        setContentAr("");
        setContentEn("");
        setSelectedPlatforms([]);
        setSelectedCampaign("");
        setUploadedMedia([]);
        setFiles([]);
        setCurrentStep(1);
        setError("");
      } else {
        const m = locale === "ar" ? result.arMessage : result.enMessage;
        setError(m);
        toast.error(m, { icon: <AlertCircle className="h-4 w-4" /> });
      }
    });
  };

  /* ------------------------------ PREVIEW UI ------------------------------ */

  const currentContent = contentTab === "ar" ? contentAr : contentEn;

  const UnifiedPreview = ({ platform }: any) => {
    const Icon = getPlatformIcon(platform.id);

    return (
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex gap-3 mb-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/20 font-bold">
            Y
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{platform.username}</span>
              <Icon className="w-4 h-4" />
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
              <Carousel className="w-full" opts={{ align: "start" }}>
                <CarouselContent className="-ml-1 w-full">
                  {uploadedMedia.map((m, i) => (
                    <CarouselItem key={i} className="pl-1 basis-full">
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

  /* -------------------------------------------------------------------------- */
  /*                                    RENDER                                 */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* --------------------------- Progress & Steps -------------------------- */}

        <div>
          <div className="flex justify-between mb-2">
            <h1 className="text-xl font-bold">{text.createPost}</h1>
            <span className="text-sm text-muted-foreground">
              {Math.round(calculateProgress())}% {text.complete}
            </span>
          </div>

          <Progress value={calculateProgress()} className="h-2" />

          <div className="flex justify-between mt-6">
            <StepIndicator
              step={1}
              title={text.platforms.title}
              isActive={currentStep === 1}
              isCompleted={selectedPlatforms.length > 0}
              onClick={() => navigateToStep(1)}
            />

            <StepIndicator
              step={2}
              title={text.campaigns.title}
              isActive={currentStep === 2}
              isCompleted={!!selectedCampaign}
              onClick={() => navigateToStep(2)}
            />

            <StepIndicator
              step={3}
              title={text.media.title}
              isActive={currentStep === 3}
              isCompleted={uploadedMedia.length > 0}
              onClick={() => navigateToStep(3)}
            />

            <StepIndicator
              step={4}
              title={text.contentEditor.title}
              isActive={currentStep === 4}
              isCompleted={!!(contentAr || contentEn)}
              onClick={() => navigateToStep(4)}
            />

            <StepIndicator
              step={5}
              title={text.schedule.title}
              isActive={currentStep === 5}
              isCompleted={
                scheduleType === "now" || (scheduleDate && scheduleTime)
              }
              onClick={() => navigateToStep(5)}
            />
          </div>
        </div>

        {/* ------------------------------ FORM -------------------------------- */}

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          ref={formRef}
        >
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
            {/* ------------------------------ LEFT SIDE ----------------------------- */}

            <div
              className={cn(
                "space-y-4 transition-all",
                isAnimating ? "opacity-0" : "opacity-100",
              )}
            >
              {/* -------------------------- PLATFORM SELECTOR ------------------------- */}

              <Card
                className={cn(
                  currentStep === 1 && "ring-2 ring-primary shadow-lg",
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
                    {platforms.map((p) => {
                      const Icon = getPlatformIcon(p.id);
                      const isSelected = selectedPlatforms.includes(p.id);

                      return (
                        <Button
                          key={p.id}
                          type="button"
                          onClick={() => handlePlatformToggle(p.id)}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className={cn(
                            "transition-transform hover:scale-105",
                            isSelected && getPlatformColor(p.id),
                          )}
                        >
                          <Icon className="w-3 h-3 mr-1" />
                          {p.username}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* ---------------------------- CAMPAIGN SELECTOR --------------------------- */}

              <Card
                className={cn(
                  currentStep === 2 && "ring-2 ring-primary shadow-lg",
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
                  <Tabs
                    value={selectedCampaign}
                    onValueChange={setSelectedCampaign}
                  >
                    <TabsList className="grid grid-cols-1">
                      <TabsTrigger value="">
                        {text.campaigns.placeholder}
                      </TabsTrigger>

                      {campaigns
                        .filter((c) => c.status === "active")
                        .map((camp) => (
                          <TabsTrigger key={camp.id} value={camp.id.toString()}>
                            {camp.name}
                          </TabsTrigger>
                        ))}
                    </TabsList>
                  </Tabs>
                </CardContent>
              </Card>

              {/* ------------------------------- MEDIA UPLOAD ------------------------------ */}

              <Card
                className={cn(
                  currentStep === 3 && "ring-2 ring-primary shadow-lg",
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
                    {/* Image Upload */}
                    <label className="border-dashed border-2 rounded-lg p-4 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition">
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

                    {/* Video Upload */}
                    <label className="border-dashed border-2 rounded-lg p-4 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition">
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
                        <span>
                          {locale === "ar" ? "جاري الرفع..." : "Uploading..."}
                        </span>
                        <span>{uploadProgress}%</span>
                      </div>

                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}

                  {/* Media Grid */}
                  {uploadedMedia.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {uploadedMedia.map((m, i) => (
                        <div
                          key={i}
                          className="relative group overflow-hidden rounded-lg"
                        >
                          <img src={m} className="h-20 w-full object-cover" />

                          <button
                            type="button"
                            onClick={() => removeMedia(i)}
                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* ----------------------------- CONTENT EDITOR ----------------------------- */}

              <Card
                className={cn(
                  currentStep === 4 && "ring-2 ring-primary shadow-lg",
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
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* ------------------------------ RIGHT SIDE ----------------------------- */}

            <div
              className={cn(
                "space-y-4 transition-all",
                isAnimating ? "opacity-0" : "opacity-100",
              )}
            >
              {/* ------------------------------- PREVIEW ------------------------------- */}

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

              {/* -------------------------------- SCHEDULE -------------------------------- */}

              <Card
                className={cn(
                  currentStep === 5 && "ring-2 ring-primary shadow-lg",
                )}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {text.schedule.title}

                    {(scheduleType === "now" ||
                      (scheduleDate && scheduleTime)) && (
                      <Badge variant="secondary" className="ml-auto">
                        <CheckCircle className="w-3 h-3 mr-1" />
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
                      <TabsTrigger value="now">
                        <Clock className="w-3 h-3 mr-1" />
                        {text.schedule.publishNowTab}
                      </TabsTrigger>

                      <TabsTrigger value="later">
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
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                          />
                        </div>

                        <div>
                          <Label>{text.schedule.timeLabel}</Label>
                          <Input
                            type="time"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {error && (
                    <p className="text-sm text-destructive mt-2">{error}</p>
                  )}

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

      {/* Fade animation */}
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
