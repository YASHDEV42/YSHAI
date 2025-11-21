"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
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
  CheckCircle,
} from "lucide-react";
import type { TConnectedAccount } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

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
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        text.aiAdvisor?.welcomeMessage ||
        "Hello! How can I help you with your content strategy today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingProgress, setThinkingProgress] = useState<number | null>(null);

  const quickActions = [
    {
      icon: TrendingUp,
      label: text.aiAdvisor?.quickAction1 || "Best time to post?",
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      icon: Users,
      label: text.aiAdvisor?.quickAction2 || "Analyze performance",
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      icon: Lightbulb,
      label: text.aiAdvisor?.quickAction3 || "Content ideas",
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      icon: Target,
      label: "Audience insights",
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ];

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setThinkingProgress(0);

    toast.loading("AI is thinking...", {
      id: "ai-thinking",
    });

    // Simulate thinking progress
    const progressInterval = setInterval(() => {
      setThinkingProgress((prev) => {
        if (prev === null) return 20;
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    // Simulate AI response
    setTimeout(() => {
      clearInterval(progressInterval);
      setThinkingProgress(100);

      const aiResponse = {
        role: "assistant" as const,
        content: `Based on your recent content performance, I recommend posting at 2 PM on weekdays for maximum engagement. Your audience is most active during this time, and your posts tend to get 30% more interactions when published then.`,
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);

      toast.success("AI response generated", {
        id: "ai-thinking",
        icon: <CheckCircle className="h-4 w-4" />,
        duration: 2000,
      });

      // Reset progress after a delay
      setTimeout(() => {
        setThinkingProgress(null);
      }, 1000);
    }, 2000);
  };

  const handleQuickAction = (action: any) => {
    setInput(action.label);
    toast.info(`Preparing ${action.label} query...`, {
      icon: <Zap className="h-4 w-4" />,
      duration: 1500,
    });
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
                  Beta
                </span>
              </CardTitle>
              <CardDescription className="mt-1">
                {text.aiAdvisor?.description ||
                  text.aiInsights?.description ||
                  "Get personalized insights"}
              </CardDescription>
            </div>
            <Zap className="size-5 text-primary animate-pulse" />
          </div>
        </CardHeader>
      </Card>

      {/* Quick Actions Grid */}
      <div
        className={cn(
          "grid gap-3 md:grid-cols-2 lg:grid-cols-4",
          animateItems
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4",
        )}
        style={{ animationDelay: "200ms" }}
      >
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card
              key={index}
              className={cn(
                "cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-105 border-border/50",
                animateItems
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4",
              )}
              style={{ animationDelay: `${300 + index * 100}ms` }}
              onClick={() => handleQuickAction(action)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-10 items-center justify-center rounded-lg ${action.bgColor} transition-all duration-300 hover:scale-110`}
                  >
                    <Icon className={`size-5 ${action.color}`} />
                  </div>
                  <p className="text-sm font-medium leading-tight">
                    {action.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chat Interface */}
      <Card
        className={cn(
          "transition-all duration-300 hover:shadow-md",
          animateItems
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4",
        )}
        style={{ animationDelay: "500ms" }}
      >
        <CardHeader>
          <CardTitle className="text-lg">Conversation</CardTitle>
          <CardDescription>
            Ask me anything about your content strategy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Messages Container */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto p-4 rounded-lg bg-muted/30 border border-border/50">
              {messages.map((message, index) => (
                <div
                  key={index}
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
                      "max-w-[80%] rounded-xl p-3 shadow-sm transition-all duration-300",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background border border-border",
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="size-8 shrink-0 shadow-sm">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {account.username?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary shrink-0 shadow-sm">
                    <Sparkles className="size-4 text-primary-foreground" />
                  </div>
                  <div className="bg-background border border-border rounded-xl p-3 shadow-sm">
                    {thinkingProgress !== null ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>AI is thinking...</span>
                          <span>{thinkingProgress}%</span>
                        </div>
                        <Progress
                          value={thinkingProgress}
                          className="h-1 w-32"
                          dir={locale === "ar" ? "rtl" : "ltr"}
                        />
                      </div>
                    ) : (
                      <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="flex gap-2 items-end">
              <Textarea
                placeholder={
                  text.aiAdvisor?.inputPlaceholder || "Ask me anything..."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="resize-none min-h-[60px] shadow-sm transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                rows={2}
              />
              <Button
                disabled={!input.trim() || isLoading}
                size="icon"
                className="shrink-0 size-12 shadow-sm transition-all duration-300 hover:scale-110"
                onClick={handleSendMessage}
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </div>

            {/* Suggested Actions */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-xs text-muted-foreground">Try asking:</span>
              {[
                text.aiAdvisor?.quickAction1 || "Best time to post?",
                text.aiAdvisor?.quickAction2 || "Analyze performance",
                text.aiAdvisor?.quickAction3 || "Content ideas",
              ].map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 transition-all duration-300 hover:scale-105 bg-transparent"
                  onClick={() => setInput(suggestion)}
                >
                  {suggestion}
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
        <Card className="border-border/50 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 shrink-0 transition-all duration-300 hover:scale-110">
                <TrendingUp className="size-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Performance Insights</p>
                <p className="text-xs text-muted-foreground">
                  Get detailed analysis of your content performance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 shrink-0 transition-all duration-300 hover:scale-110">
                <Lightbulb className="size-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Content Suggestions</p>
                <p className="text-xs text-muted-foreground">
                  Receive AI-powered content ideas tailored to your audience
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 shrink-0 transition-all duration-300 hover:scale-110">
                <Users className="size-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Audience Analysis</p>
                <p className="text-xs text-muted-foreground">
                  Understand your audience demographics and behavior
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
