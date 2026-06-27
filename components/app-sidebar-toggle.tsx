'use client';

import { MenuIcon, PanelLeftCloseIcon, PanelLeftOpenIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppSidebar } from '@/components/app-sidebar-provider';
import { cn } from '@/lib/utils';

export function AppSidebarCollapseToggle({ className }: { className?: string }) {
  const { collapsed, toggle } = useAppSidebar();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn('size-8 shrink-0', className)}
      onClick={toggle}
      aria-expanded={!collapsed}
      aria-controls="app-sidebar"
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {collapsed ? <PanelLeftOpenIcon aria-hidden /> : <PanelLeftCloseIcon aria-hidden />}
    </Button>
  );
}

export function AppSidebarToggle({ className }: { className?: string }) {
  const { mobileOpen, toggleMobile } = useAppSidebar();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn('size-9 shrink-0 md:hidden', className)}
      onClick={toggleMobile}
      aria-expanded={mobileOpen}
      aria-controls="app-mobile-sidebar"
      aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
    >
      {mobileOpen ? <XIcon aria-hidden /> : <MenuIcon aria-hidden />}
    </Button>
  );
}
