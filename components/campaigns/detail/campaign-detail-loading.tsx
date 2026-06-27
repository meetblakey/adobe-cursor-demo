import { Skeleton } from '@/components/ui/skeleton';

export function CampaignDetailLoading() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading campaign">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="aspect-21/9 w-full rounded-xl" />
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-full max-w-lg" />
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17.5rem]">
        <div className="flex flex-col gap-5">
          <div className="border-b border-border pb-3">
            <div className="flex gap-1 overflow-hidden rounded-lg bg-muted p-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-7 w-20 shrink-0 rounded-md" />
              ))}
            </div>
          </div>
          <Skeleton className="h-56 w-full rounded-xl" />
        </div>
        <aside className="flex flex-col gap-4">
          <Skeleton className="h-44 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </aside>
      </div>
    </div>
  );
}
