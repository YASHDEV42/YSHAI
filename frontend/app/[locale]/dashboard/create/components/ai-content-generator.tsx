"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Loader2, Check, X } from "lucide-react";
import { useCompletion } from "@ai-sdk/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type AIMode = "generate" | "improve" | "hashtags";

interface Platform {
  id: string;
  name: string;
  username?: string;
}

interface AIContentGeneratorProps {
  locale: string;
  text: any;
  selectedTone: string;
  onToneChange: (tone: string) => void;
  selectedPlatforms: string[];
  platforms: Platform[];
  content: string;
  onContentChange: (content: string) => void;
}

export default function AIContentGenerator({
  locale,
  text,
  selectedTone,
  onToneChange,
  selectedPlatforms,
  platforms,
  content,
  onContentChange,
}: AIContentGeneratorProps) {
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiMode, setAiMode] = useState<AIMode>("generate");
  const [preview, setPreview] = useState("");

  const isRTL = locale === "ar";

  const { complete, completion, isLoading } = useCompletion({
    api: "/api/ai/content-generator",
    onFinish: (prompt, completion) => {
      if (aiMode === "generate") {
        // Mode 1: Immediately replace content
        onContentChange(completion);
        setAiPrompt("");
        toast.success(
          locale === "ar"
            ? "تم توليد المحتوى بنجاح!"
            : "Content generated successfully!",
          {
            icon: <Sparkles className="h-4 w-4" />,
          },
        );
      } else {
        // Mode 2 & 3: Show preview
        setPreview(completion);
      }
    },
    onError: (error) => {
      console.error("[v0] AI generation failed:", error);
      toast.error(
        locale === "ar"
          ? "فشل توليد المحتوى. حاول مرة أخرى."
          : "Failed to generate content. Please try again.",
      );
    },
  });

  const handleGenerate = async () => {
    if (!aiPrompt.trim() && aiMode === "generate") {
      toast.error(
        locale === "ar"
          ? "الرجاء إدخال وصف للمحتوى"
          : "Please enter a content description",
      );
      return;
    }

    if ((aiMode === "improve" || aiMode === "hashtags") && !content.trim()) {
      toast.error(
        locale === "ar"
          ? "الرجاء إدخال محتوى أولاً"
          : "Please enter content first",
      );
      return;
    }

    setPreview("");

    // Get target platform for optimization
    const targetPlatform =
      selectedPlatforms.length > 0
        ? platforms.find((p) => p.id === selectedPlatforms[0])?.name
        : undefined;

    await complete(aiPrompt, {
      body: {
        mode: aiMode,
        content: aiMode !== "generate" ? content : undefined,
        platform: targetPlatform,
        language: locale,
        tone: selectedTone,
      },
    });
  };

  const handleApply = () => {
    if (aiMode === "improve") {
      // Mode 2: Replace content with preview
      onContentChange(preview);
    } else if (aiMode === "hashtags") {
      // Mode 3: Append hashtags to content
      onContentChange(content + "\n\n" + preview);
    }
    setPreview("");
    setAiPrompt("");
    toast.success(
      locale === "ar" ? "تم تطبيق التغييرات!" : "Changes applied!",
      {
        icon: <Check className="h-4 w-4" />,
      },
    );
  };

  const handleDiscard = () => {
    setPreview("");
    setAiPrompt("");
    toast(locale === "ar" ? "تم التجاهل" : "Discarded", {
      icon: <X className="h-4 w-4" />,
      duration: 1500,
    });
  };

  return (
    <div className="p-4 border rounded-lg bg-gradient-to-br bg-primary/5 space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary" />
        <Label className="text-sm font-semibold">
          {text.aiGenerator?.title || "AI Content Generator"}
        </Label>
      </div>

      {/* Mode Selector */}
      <Tabs value={aiMode} onValueChange={(v) => setAiMode(v as AIMode)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">
            {locale === "ar" ? "توليد جديد" : "Generate"}
          </TabsTrigger>
          <TabsTrigger value="improve">
            {locale === "ar" ? "تحسين" : "Improve"}
          </TabsTrigger>
          <TabsTrigger value="hashtags">
            {locale === "ar" ? "هاشتاقات" : "Hashtags"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-3 mt-3">
          <Textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder={
              locale === "ar"
                ? "اكتب ما تريد نشره..."
                : "Describe what you want to post..."
            }
            rows={3}
            className="bg-background"
            disabled={isLoading}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </TabsContent>

        <TabsContent value="improve" className="space-y-3 mt-3">
          <Textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder={
              locale === "ar"
                ? "اختياري: اذكر ما تريد تحسينه..."
                : "Optional: specify what to improve..."
            }
            rows={3}
            className="bg-background"
            disabled={isLoading}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </TabsContent>

        <TabsContent value="hashtags" className="space-y-3 mt-3">
          <Textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder={
              locale === "ar"
                ? "اختياري: حدد موضوع الهاشتاقات..."
                : "Optional: specify hashtag theme..."
            }
            rows={3}
            className="bg-background"
            disabled={isLoading}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </TabsContent>
      </Tabs>

      {/* Tone and Generate Button */}
      <div className="flex items-center gap-2">
        <Select value={selectedTone} onValueChange={onToneChange}>
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
          onClick={handleGenerate}
          disabled={isLoading}
          className="flex-1"
          size="sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {locale === "ar" ? "جاري التوليد..." : "Generating..."}
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              {text.aiGenerator?.generate || "Generate"}
            </>
          )}
        </Button>
      </div>

      {/* Preview for modes 2 & 3 */}
      {preview && (aiMode === "improve" || aiMode === "hashtags") && (
        <div
          className={cn(
            "p-3 rounded-lg bg-background border-2 border-primary/30 space-y-2",
            "animate-in fade-in slide-in-from-top-2 duration-300",
          )}
        >
          <Label className="text-xs text-muted-foreground">
            {locale === "ar" ? "المعاينة:" : "Preview:"}
          </Label>
          <div
            className="text-sm whitespace-pre-wrap"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {aiMode === "improve" ? preview : `${content}\n\n${preview}`}
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={handleApply}
              className="flex-1"
              variant="default"
            >
              <Check className="w-4 h-4 mr-1" />
              {locale === "ar" ? "تطبيق" : "Apply"}
            </Button>
            <Button
              size="sm"
              onClick={handleDiscard}
              className="flex-1 bg-transparent"
              variant="outline"
            >
              <X className="w-4 h-4 mr-1" />
              {locale === "ar" ? "إلغاء" : "Discard"}
            </Button>
          </div>
        </div>
      )}

      {/* Streaming indicator for mode 1 */}
      {isLoading && aiMode === "generate" && completion && (
        <div
          className="p-3 rounded-lg bg-background border border-border animate-pulse"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="text-sm text-muted-foreground whitespace-pre-wrap">
            {completion}
          </div>
        </div>
      )}
    </div>
  );
}
