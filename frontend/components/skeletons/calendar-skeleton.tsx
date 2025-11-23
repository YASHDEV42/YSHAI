import { Skeleton } from "@/components/ui/skeleton";

export function CalendarSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Calendar header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      {/* Calendar grid */}
      <div className="rounded-lg border bg-card">
        {/* Days of week */}
        <div className="grid grid-cols-7 gap-px border-b bg-muted">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="p-3 text-center bg-card">
              <Skeleton className="h-4 w-8 mx-auto" />
            </div>
          ))}
        </div>
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-px bg-muted">
          {[...Array(35)].map((_, i) => (
            <div key={i} className="min-h-[120px] p-2 bg-card">
              <Skeleton className="h-6 w-6 mb-2" />
              <div className="space-y-1">
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-2 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
