'use client';

import { Suspense, type ReactNode } from 'react';
import { AppMobileSidebar } from '@/components/app-mobile-sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarFallback } from '@/components/app-sidebar-fallback';

export function AppShell({
  header,
  children,
}: {
  header: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <AppMobileSidebar />
      <div className="flex min-h-dvh flex-1">
        <Suspense fallback={<AppSidebarFallback />}>
          <AppSidebar />
        </Suspense>
        <div className="flex min-w-0 flex-1 flex-col">
          {header}
          <div className="min-w-0 flex-1 overflow-x-hidden">{children}</div>
        </div>
      </div>
    </>
  );
}
