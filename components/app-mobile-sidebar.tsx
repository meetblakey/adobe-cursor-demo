'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { AdobeLogo } from '@/components/adobe-logo';
import { AppSidebarNav } from '@/components/app-sidebar-nav';
import { useAppSidebar } from '@/components/app-sidebar-provider';
import { cn } from '@/lib/utils';

export function AppMobileSidebar() {
  const { mobileOpen, closeMobile } = useAppSidebar();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (mobileOpen && !dialog.open) dialog.showModal();
    if (!mobileOpen && dialog.open) dialog.close();
  }, [mobileOpen]);

  return (
    <dialog
      id="app-mobile-sidebar"
      ref={dialogRef}
      className={cn(
        'fixed inset-0 z-50 m-0 hidden h-full max-h-none w-full max-w-none bg-transparent p-0',
        'open:flex md:hidden',
        '[&::backdrop]:bg-foreground/40',
      )}
      aria-label="Application menu"
      onClose={closeMobile}
      onClick={(event) => {
        if (event.target === dialogRef.current) closeMobile();
      }}
    >
      {mobileOpen ? (
        <div className="flex h-full w-[min(100%,16rem)] flex-col border-r border-sidebar-border bg-sidebar pt-[env(safe-area-inset-top,0px)] shadow-lg motion-safe:animate-in motion-safe:slide-in-from-left motion-safe:duration-200">
          <div className="flex h-14 shrink-0 items-center border-b border-sidebar-border px-3">
            <Link
              href="/campaigns"
              className="flex shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
              aria-label="Adobe Pigment Studio campaigns home"
              onClick={closeMobile}
            >
              <AdobeLogo />
            </Link>
          </div>
          <AppSidebarNav collapsed={false} onNavigate={closeMobile} touchFriendly />
        </div>
      ) : null}
    </dialog>
  );
}
