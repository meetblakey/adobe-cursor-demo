import { Skeleton } from '@/components/ui/skeleton';

export function CampaignsLoading() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading campaigns">
      <div className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-2">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-full max-w-lg" />
        </div>
        <div className="flex min-w-0 items-center justify-between gap-3">
          <div className="flex min-w-0 flex-nowrap items-center gap-2 overflow-hidden">
            <Skeleton className="h-8 w-[4.5rem] shrink-0 rounded-lg" />
            <Skeleton className="h-8 w-36 shrink-0 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-32 shrink-0 rounded-lg" />
        </div>
      </div>
      <Skeleton className="h-72 w-full rounded-xl" />
    </div>
  );
}
