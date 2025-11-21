"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  progressValue?: number;
  borderColor?: string;
  iconColor?: string;
  iconBgColor?: string;
  className?: string;
  animationDelay?: string;
  animate?: boolean;
  locale?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  progressValue = 0,
  className,
  animationDelay = "0ms",
  animate = false,
  locale = "en",
}: StatCardProps) {
  const isRTL = locale === "ar";

  return (
    <Card
      className={cn(
        "border-l-4 hover:border-l-primary transition-all duration-300 hover:shadow-md hover:scale-[1.02]",
        animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className,
      )}
      style={{ animationDelay }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && (
          <div
            className={cn(
              "p-2 rounded-lg transition-all bg-accent duration-300 group-hover:scale-110",
            )}
          >
            <Icon className={cn("size-5 opacity-80")} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {progressValue !== undefined && (
          <div className="mt-2">
            <Progress
              value={progressValue}
              className="h-1"
              dir={isRTL ? "rtl" : "ltr"}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
