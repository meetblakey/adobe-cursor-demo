'use client';

import type { ReactNode } from 'react';
import { AppSidebarProvider } from '@/components/app-sidebar-provider';

export function AppSidebarLayout({ children }: { children: ReactNode }) {
  return <AppSidebarProvider>{children}</AppSidebarProvider>;
}
