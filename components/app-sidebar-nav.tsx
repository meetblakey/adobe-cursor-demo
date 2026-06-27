'use client';

import type { ComponentType } from 'react';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3Icon,
  CheckCircle2Icon,
  FolderOpenIcon,
  LayoutGridIcon,
  MegaphoneIcon,
  PaletteIcon,
  SettingsIcon,
  UsersIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { pageTopClassName } from '@/lib/page-layout';

const NAV_ITEMS = [
  { label: 'Campaigns', href: '/campaigns', icon: MegaphoneIcon },
  { label: 'Analytics', href: '#', icon: BarChart3Icon, mock: true },
  { label: 'Brand library', href: '#', icon: PaletteIcon, mock: true },
  { label: 'Assets', href: '#', icon: FolderOpenIcon, mock: true },
  { label: 'Approvals', href: '#', icon: CheckCircle2Icon, mock: true },
  { label: 'Workspaces', href: '#', icon: LayoutGridIcon, mock: true },
] as const;

const BOTTOM_ITEMS = [
  { label: 'Team', href: '#', icon: UsersIcon, mock: true },
  { label: 'Settings', href: '#', icon: SettingsIcon, mock: true },
] as const;

const navItemInteractiveClassName = cn(
  'text-sidebar-foreground/80',
  'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
  'active:bg-sidebar-accent/90',
  'focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar',
);

const navItemActiveClassName = cn(
  'bg-primary/10 font-medium text-primary',
  'ring-1 ring-inset ring-primary/20',
  'hover:bg-primary/15 hover:text-primary',
  'active:bg-primary/20',
);

function sidebarNavItemClassName({
  collapsed,
  isActive,
  mock,
  touchFriendly,
}: {
  collapsed: boolean;
  isActive?: boolean;
  mock?: boolean;
  touchFriendly?: boolean;
}) {
  const itemHeight = touchFriendly ? 'h-11' : 'h-9';
  return cn(
    'group/nav-item relative flex w-full items-center rounded-lg text-sm outline-none',
    'motion-safe:transition-[color,background-color,box-shadow]',
    collapsed ? 'size-9 justify-center' : cn(itemHeight, 'gap-2.5 px-2.5'),
    mock
      ? cn(
          'cursor-not-allowed font-normal text-sidebar-foreground/55',
          'hover:bg-sidebar-accent/50 hover:text-sidebar-foreground/75',
          'active:bg-sidebar-accent/40',
        )
      : cn(navItemInteractiveClassName, isActive && navItemActiveClassName),
  );
}

function NavItemIcon({
  icon: Icon,
  mock,
  isActive,
}: {
  icon: ComponentType<{ className?: string }>;
  mock?: boolean;
  isActive?: boolean;
}) {
  return (
    <Icon
      className={cn(
        'size-4 shrink-0 motion-safe:transition-colors',
        mock
          ? 'text-sidebar-foreground/55 group-hover/nav-item:text-sidebar-foreground/75'
          : isActive
            ? 'text-primary'
            : 'text-sidebar-foreground/70 group-hover/nav-item:text-sidebar-accent-foreground',
      )}
      aria-hidden
    />
  );
}

function NavItem({
  label,
  href,
  icon,
  mock,
  collapsed,
  touchFriendly,
}: {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  mock?: boolean;
  collapsed: boolean;
  touchFriendly?: boolean;
}) {
  const pathname = usePathname();
  const isActive =
    !mock &&
    (href === '/campaigns'
      ? pathname === href || pathname.startsWith(`${href}/`)
      : pathname.startsWith(href));

  const className = sidebarNavItemClassName({ collapsed, isActive, mock, touchFriendly });
  const content = (
    <>
      <NavItemIcon icon={icon} mock={mock} isActive={isActive} />
      {!collapsed ? <span className="truncate">{label}</span> : null}
    </>
  );

  if (mock) {
    return (
      <button
        type="button"
        className={className}
        aria-label={`${label} (coming soon)`}
        title={collapsed ? `${label} (coming soon)` : 'Coming soon'}
        onClick={(event) => event.preventDefault()}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      data-active={isActive ? true : undefined}
      aria-current={isActive ? 'page' : undefined}
      title={collapsed ? label : undefined}
    >
      {content}
    </Link>
  );
}

export function AppSidebarNav({
  collapsed,
  onNavigate,
  touchFriendly = false,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
  touchFriendly?: boolean;
}) {
  const pathname = usePathname();
  const isFirstPathname = useRef(true);

  useEffect(() => {
    if (isFirstPathname.current) {
      isFirstPathname.current = false;
      return;
    }
    onNavigate?.();
  }, [pathname, onNavigate]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <nav
        className={cn(
          'flex flex-1 flex-col gap-1 overflow-y-auto px-2 pb-2',
          pageTopClassName,
        )}
        aria-label="Main"
      >
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.label}
            {...item}
            collapsed={collapsed}
            touchFriendly={touchFriendly}
          />
        ))}
      </nav>
      <nav
        className="flex flex-col gap-1 border-t border-sidebar-border p-2"
        aria-label="Account"
      >
        {BOTTOM_ITEMS.map((item) => (
          <NavItem
            key={item.label}
            {...item}
            collapsed={collapsed}
            touchFriendly={touchFriendly}
          />
        ))}
      </nav>
    </div>
  );
}
