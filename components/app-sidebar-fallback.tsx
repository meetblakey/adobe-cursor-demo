import { Skeleton } from '@/components/ui/skeleton';
import { pageTopClassName } from '@/lib/page-layout';
import { cn } from '@/lib/utils';

export function AppSidebarFallback() {
  return (
    <aside
      className="sticky top-0 hidden h-dvh w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar pt-[env(safe-area-inset-top,0px)] md:flex"
      aria-hidden
    >
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-sidebar-border px-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="size-8 rounded-lg" />
      </div>
      <div className={cn('flex flex-1 flex-col gap-2 px-3 pb-3', pageTopClassName)}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-full rounded-lg" />
        ))}
      </div>
      <div className="flex flex-col gap-2 border-t border-sidebar-border p-3">
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
    </aside>
  );
}
