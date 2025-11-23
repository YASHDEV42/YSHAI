import { Skeleton } from "@/components/ui/skeleton";

export function CreateSkeleton() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page header */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main content area */}
          <div className="md:col-span-2 space-y-6">
            {/* Compose area */}
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-40 w-full" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-10" />
                ))}
              </div>
            </div>

            {/* Media upload */}
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Platform selector */}
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded border"
                  >
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
