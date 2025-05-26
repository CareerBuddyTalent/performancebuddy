
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "card" | "list" | "chart";
}

export function OptimizedSkeleton({ 
  className, 
  variant = "default",
  ...props 
}: SkeletonProps) {
  const variants = {
    default: "animate-pulse rounded-md bg-muted",
    card: "animate-pulse rounded-lg bg-muted/50 border",
    list: "animate-pulse rounded bg-muted/30",
    chart: "animate-pulse rounded-md bg-gradient-to-r from-muted to-muted/50"
  };

  return (
    <div
      className={cn(variants[variant], className)}
      {...props}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <OptimizedSkeleton className="h-8 w-48" />
        <OptimizedSkeleton className="h-10 w-32" />
      </div>
      
      {/* Stats cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <OptimizedSkeleton key={i} variant="card" className="h-32" />
        ))}
      </div>
      
      {/* Chart skeleton */}
      <OptimizedSkeleton variant="chart" className="h-80" />
      
      {/* Table skeleton */}
      <div className="space-y-2">
        <OptimizedSkeleton className="h-10 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <OptimizedSkeleton key={i} variant="list" className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <OptimizedSkeleton className="h-8 w-64" />
      <OptimizedSkeleton className="h-4 w-96" />
      <div className="grid gap-4 md:grid-cols-2">
        <OptimizedSkeleton variant="card" className="h-48" />
        <OptimizedSkeleton variant="card" className="h-48" />
      </div>
    </div>
  );
}
