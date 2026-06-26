import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <div className="flex items-center gap-2.5">
        <span className="size-5 rounded-md bg-primary" aria-hidden />
        <Link href="/campaigns" className="font-heading text-sm font-semibold">
          Pigment Studio
        </Link>
        <span className="text-xs text-muted-foreground">· Console</span>
      </div>
      <ThemeToggle />
    </header>
  );
}
