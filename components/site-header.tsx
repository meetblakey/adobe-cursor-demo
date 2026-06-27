import Link from 'next/link';
import { AppSidebarToggle } from '@/components/app-sidebar-toggle';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { pageGutterClassName, pageShellClassName } from '@/lib/page-layout';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center border-b bg-background pt-[env(safe-area-inset-top,0px)]">
      <div
        className={cn(
          pageShellClassName,
          pageGutterClassName,
          'flex min-w-0 flex-1 items-center justify-between gap-3',
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <AppSidebarToggle />
          <Link
            href="/campaigns"
            className="truncate font-heading text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Pigment Studio
          </Link>
          <span className="hidden text-xs text-muted-foreground md:inline">Console</span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center gap-2 rounded-full sm:w-auto sm:justify-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Blake Rowley account menu (demo)"
          >
            <span className="hidden text-sm text-muted-foreground sm:inline">Blake Rowley</span>
            <Avatar size="sm">
              <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                BR
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>
    </header>
  );
}
