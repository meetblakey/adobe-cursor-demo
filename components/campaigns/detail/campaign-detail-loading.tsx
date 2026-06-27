import { Skeleton } from '@/components/ui/skeleton';

export function CampaignDetailLoading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="aspect-21/9 w-full rounded-xl" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-4 w-full max-w-lg" />
      </div>
      <Skeleton className="h-20 w-full rounded-xl" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-full max-w-md" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
        <aside className="flex flex-col gap-4">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </aside>
      </div>
    </div>
  );
}
