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
} from "lucide-react";
import type { TConnectedAccount } from "@/types";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIAgentTabProps {
  text: any;
  account: TConnectedAccount;
}

export function AIAgentTab({ text, account }: AIAgentTabProps) {
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

  return (
    <div className="space-y-6">
      {/* AI Agent Header Card */}
      <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-background border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/20 backdrop-blur-sm">
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
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-md transition-all hover:scale-105 border-border/50"
              onClick={() => setInput(action.label)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-10 items-center justify-center rounded-lg ${action.bgColor}`}
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
      <Card>
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
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary shrink-0 shadow-sm">
                      <Sparkles className="size-4 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl p-3 shadow-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background border border-border"
                    }`}
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
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
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
                    // Handle send message here
                  }
                }}
                className="resize-none min-h-[60px] shadow-sm"
                rows={2}
              />
              <Button
                disabled={!input.trim() || isLoading}
                size="icon"
                className="shrink-0 size-12 shadow-sm"
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
                  className="text-xs h-7"
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
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
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

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
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

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
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
