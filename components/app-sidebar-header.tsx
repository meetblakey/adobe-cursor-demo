'use client';

import Link from 'next/link';
import { AdobeLogo } from '@/components/adobe-logo';
import { AppSidebarCollapseToggle } from '@/components/app-sidebar-toggle';
import { useAppSidebar } from '@/components/app-sidebar-provider';
import { cn } from '@/lib/utils';

export function AppSidebarHeader() {
  const { collapsed } = useAppSidebar();

  return (
    <div
      className={cn(
        'flex h-14 shrink-0 items-center border-b border-sidebar-border',
        collapsed ? 'justify-center' : 'justify-between px-3',
      )}
    >
      {!collapsed ? (
        <Link
          href="/campaigns"
          className="flex shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
          aria-label="Adobe Pigment Studio campaigns home"
        >
          <AdobeLogo />
        </Link>
      ) : null}
      <AppSidebarCollapseToggle />
    </div>
  );
}
