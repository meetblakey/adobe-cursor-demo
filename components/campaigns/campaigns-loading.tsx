import { Skeleton } from '@/components/ui/skeleton';

export function CampaignsLoading() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading campaigns">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-full max-w-lg" />
          <Skeleton className="h-3 w-64" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-7 w-28" />
        </div>
      </div>
      <Skeleton className="h-72 w-full rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
