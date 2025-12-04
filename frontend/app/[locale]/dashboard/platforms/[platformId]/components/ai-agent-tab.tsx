"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sparkles,
  Send,
  Loader2,
  Lightbulb,
  TrendingUp,
  Users,
  Target,
  Zap,
  AlertCircle,
  CirclePause,
} from "lucide-react";
import type { TConnectedAccount } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DefaultChatTransport } from "ai";
import { getAIAdvisorContextForAccount } from "../action";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface AIAgentTabProps {
  text: any;
  locale?: string;
  account: TConnectedAccount;
  animateItems?: boolean;
}

export function AIAgentTab({
  text,
  locale = "en",
  account,
  animateItems = false,
}: AIAgentTabProps) {
  const [analyticsContext, setAnalyticsContext] = useState<any>(null);
  const [isLoadingContext, setIsLoadingContext] = useState(true);
  const [inputValue, setInputValue] = useState("");

  const { messages, sendMessage, status, error, stop, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/advisor",
      body: () => ({
        accountData: {
          platform: account.provider,
          username: account.username,
          followersCount: account.followersCount,
        },
        analyticsData: analyticsContext?.analytics,
        platformData: analyticsContext?.platformData,
        topPosts: analyticsContext?.topPosts,
        audienceInsights: analyticsContext?.audienceInsights,
        healthScores: analyticsContext?.healthScores,
        recommendations: analyticsContext?.recommendations,
        postingOptimization: analyticsContext?.postingOptimization,
        locale,
      }),
    }),

    onFinish: ({ message, isError }) => {
      if (isError) {
        console.error("Chat finished with error");
      }
    },

    onError: (err) => {
      console.error("Chat error:", err);
      toast.error(
        text.aiAdvisor?.error || "Failed to get AI response. Please try again.",
      );
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    async function loadContext() {
      setIsLoadingContext(true);
      try {
        const context = await getAIAdvisorContextForAccount({
          id: account.id,
          provider: account.provider,
        });
        setAnalyticsContext(context);
      } catch (err) {
        console.error("[v0] Failed to load analytics context:", err);
      } finally {
        setIsLoadingContext(false);
      }
    }
    loadContext();
  }, [account.id, account.provider]);

  const quickActions = [
    {
      icon: TrendingUp,
      label: text.aiAdvisor?.quickAction1 || "Best time to post?",
    },
    {
      icon: Users,
      label: text.aiAdvisor?.quickAction2 || "Analyze performance",
    },
    {
      icon: Lightbulb,
      label: text.aiAdvisor?.quickAction3 || "Content ideas",
    },
    {
      icon: Target,
      label: text.aiAdvisor?.quickAction4 || "Audience insights",
    },
  ];

  const handleQuickAction = async (action: string) => {
    if (!isLoading && !isLoadingContext) {
      await sendMessage(
        { text: action },
        {
          body: {
            temperature: 0.7,
            max_tokens: 100,
          },
        },
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading && !isLoadingContext) {
      await sendMessage(
        { text: inputValue },
        { body: { temperature: 0.7, max_tokens: 100 } },
      );
      setInputValue("");
    }
  };

  // ✅ Helper to extract plain text from message parts
  const renderMessageContent = (message: any) => {
    if (!message.parts) return message.content || "";
    return message.parts
      .filter((part: any) => part.type === "text")
      .map((part: any) => part.text)
      .join("");
  };

  return (
    <div className="space-y-6">
      {/* AI Agent Header Card */}
      <Card
        className={cn(
          "bg-gradient-to-br from-primary/10 via-accent/5 to-background border-primary/20 transition-all duration-300 hover:shadow-md",
          animateItems
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4",
        )}
        style={{ animationDelay: "100ms" }}
      >
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/20 backdrop-blur-sm transition-all duration-300 hover:scale-110">
              <Sparkles className="size-6 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                {text.aiAdvisor?.title ||
                  text.aiInsights?.title ||
                  "AI Content Advisor"}
                <span className="text-xs font-normal px-2 py-1 rounded-full bg-primary/20 text-primary">
                  {text.aiAdvisor?.beta || "Beta"}
                </span>
              </CardTitle>
              <CardDescription className="mt-1">
                {text.aiAdvisor?.description ||
                  text.aiInsights?.description ||
                  "Get personalized insights about your performance and strategy."}
              </CardDescription>
            </div>
            <Zap className="size-5 text-primary animate-pulse" />
          </div>
        </CardHeader>
      </Card>

      {isLoadingContext && (
        <Alert>
          <Loader2 className="size-4 animate-spin" />
          <AlertDescription>
            {text.aiAdvisor?.loadingContext || "Loading your analytics data..."}
          </AlertDescription>
        </Alert>
      )}

      {status === "error" && error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            {error instanceof Error && error.message.includes("401")
              ? text.aiAdvisor?.authError ||
                "AI Gateway authentication required. Please add your AI_GATEWAY_API_KEY in the environment variables."
              : text.aiAdvisor?.error ||
                "Failed to get AI response. Please try again."}
          </AlertDescription>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {}}
            className="mt-2 bg-transparent"
          >
            {text.aiAdvisor?.retry || "Retry"}
          </Button>
        </Alert>
      )}

      {/* Chat Interface */}
      <Card
        className={cn(
          "transition-all duration-150 hover:shadow-md",
          animateItems
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4",
        )}
        style={{ animationDelay: "500ms" }}
      >
        <CardHeader>
          <CardTitle className="text-lg">
            {text.aiAdvisor?.conversation || "Conversation"}
          </CardTitle>
          <CardDescription>
            {text.aiAdvisor?.conversationDescription ||
              "Ask anything about your content strategy, posting times, or growth."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Messages Container */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto p-4 rounded-lg bg-muted/30 border border-border/50">
              {messages.map((message, index) => {
                const content = renderMessageContent(message);

                return (
                  <div
                    key={message.id || index}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" ? "justify-end" : "justify-start",
                      animateItems
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4",
                    )}
                    style={{ animationDelay: `${600 + index * 100}ms` }}
                  >
                    {message.role === "assistant" && (
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary shrink-0 shadow-sm">
                        <Sparkles className="size-4 text-primary-foreground" />
                      </div>
                    )}

                    <div
                      className={cn(
                        "max-w-[80%] rounded-xl p-3 shadow-sm transition-all duration-150",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-background border border-border",
                      )}
                      dir={locale === "ar" ? "rtl" : "ltr"}
                    >
                      <div
                        className={cn(
                          "prose prose-sm max-w-none",
                          message.role === "user"
                            ? "prose-invert"
                            : "dark:prose-invert",
                        )}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                        >
                          {content}
                        </ReactMarkdown>
                      </div>
                    </div>

                    {message.role === "user" && (
                      <Avatar className="size-8 shrink-0 shadow-sm">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {(account.username?.[0] || "?").toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary shrink-0 shadow-sm">
                    <Sparkles className="size-4 text-primary-foreground" />
                  </div>
                  <div className="bg-background border border-border rounded-xl p-3 shadow-sm">
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2 items-end">
              <Input
                placeholder={
                  text.aiAdvisor?.inputPlaceholder || "Ask me anything..."
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading || isLoadingContext}
                className="resize-none min-h-8 shadow-sm transition-all duration-150 focus:ring-2 focus:ring-primary/20"
              />

              {status === "streaming" || status === "submitted" ? (
                <Button
                  type="button"
                  onClick={stop}
                  size="icon"
                  className="shrink-0 shadow-sm transition-all duration-150 hover:scale-110"
                >
                  <CirclePause className="size-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading || isLoadingContext}
                  size="icon"
                  className="shrink-0 shadow-sm transition-all duration-150 hover:scale-110"
                >
                  <Send className="size-4" />
                </Button>
              )}
            </form>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-xs text-muted-foreground flex items-center">
                {text.aiAdvisor?.tryAsking || "Try asking:"}
              </span>
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 transition-all duration-150 hover:scale-105 bg-transparent"
                  onClick={() => handleQuickAction(action.label)}
                  disabled={isLoading || isLoadingContext}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Features Info */}
      <div
        className={cn(
          "grid gap-4 md:grid-cols-3",
          animateItems
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4",
        )}
        style={{ animationDelay: "600ms" }}
      >
        <Card className="border-border/50 transition-all duration-150 hover:shadow-md hover:scale-[1.02]">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 shrink-0 transition-all duration-150 hover:scale-110">
                <TrendingUp className="size-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {text.aiAdvisor?.performanceInsights ||
                    "Performance Insights"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {text.aiAdvisor?.performanceInsightsDesc ||
                    "Get detailed analysis of your content performance."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 transition-all duration-150 hover:shadow-md hover:scale-[1.02]">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 shrink-0 transition-all duration-150 hover:scale-110">
                <Lightbulb className="size-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {text.aiAdvisor?.contentSuggestions || "Content Suggestions"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {text.aiAdvisor?.contentSuggestionsDesc ||
                    "Receive AI-powered content ideas tailored to your audience."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 transition-all duration-150 hover:shadow-md hover:scale-[1.02]">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 shrink-0 transition-all duration-150 hover:scale-110">
                <Users className="size-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {text.aiAdvisor?.audienceAnalysis || "Audience Analysis"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {text.aiAdvisor?.audienceAnalysisDesc ||
                    "Understand your audience demographics and behavior."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
