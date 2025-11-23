import { Skeleton } from "@/components/ui/skeleton";

export function SidebarSkeleton() {
  return (
    <aside className="w-64 border-r bg-background">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-5 w-24" />
        </div>

        {/* Navigation items */}
        <nav className="flex-1 space-y-1 p-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
