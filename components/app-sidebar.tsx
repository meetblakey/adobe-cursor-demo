'use client';

import { AppSidebarNav } from '@/components/app-sidebar-nav';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { useAppSidebar } from '@/components/app-sidebar-provider';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const { collapsed } = useAppSidebar();

  return (
    <aside
      id="app-sidebar"
      data-collapsed={collapsed ? '' : undefined}
      className={cn(
        'sticky top-0 hidden h-dvh shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar pt-[env(safe-area-inset-top,0px)] motion-safe:transition-[width] md:flex',
        collapsed ? 'w-14' : 'w-56',
      )}
    >
      <AppSidebarHeader />
      <AppSidebarNav collapsed={collapsed} />
    </aside>
  );
}
