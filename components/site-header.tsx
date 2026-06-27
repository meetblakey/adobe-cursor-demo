import Link from 'next/link';
import { AdobeLogo } from '@/components/adobe-logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Separator } from '@/components/ui/separator';

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between border-b bg-background px-6 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href="/campaigns"
          className="shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Adobe Pigment Studio campaigns home"
        >
          <AdobeLogo />
        </Link>
        <Separator orientation="vertical" className="hidden h-4 sm:block" />
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href="/campaigns"
            className="truncate font-heading text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Pigment Studio
          </Link>
          <span className="hidden text-xs text-muted-foreground sm:inline">· Console</span>
        </div>
      </div>
      <ThemeToggle />
    </header>
  );
}
