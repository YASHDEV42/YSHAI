"use client";

import type * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

function Progress({
  className,
  value,
  dir = "ltr",
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  dir?: "ltr" | "rtl";
}) {
  const transform =
    dir === "rtl"
      ? `translateX(${100 - (value || 0)}%)`
      : `translateX(-${100 - (value || 0)}%)`;

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{ transform }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
