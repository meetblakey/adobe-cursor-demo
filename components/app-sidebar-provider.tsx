'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'pigment-studio-sidebar-collapsed';
// Same-tab notification: the `storage` event only fires in OTHER tabs.
const COLLAPSE_EVENT = 'pigment-studio-sidebar-change';

// The collapsed preference lives in localStorage (an external store), so we read it through
// useSyncExternalStore — SSR-safe (server snapshot = false), no set-state-in-effect hydration
// dance, and consistent across every provider mounted on the page.
const collapsedStore = {
  getSnapshot() {
    try {
      return window.localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  },
  getServerSnapshot() {
    return false;
  },
  subscribe(onChange: () => void) {
    window.addEventListener('storage', onChange);
    window.addEventListener(COLLAPSE_EVENT, onChange);
    return () => {
      window.removeEventListener('storage', onChange);
      window.removeEventListener(COLLAPSE_EVENT, onChange);
    };
  },
  set(next: boolean) {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // ignore storage errors
    }
    window.dispatchEvent(new Event(COLLAPSE_EVENT));
  },
};

type AppSidebarContextValue = {
  collapsed: boolean;
  mobileOpen: boolean;
  toggle: () => void;
  toggleMobile: () => void;
  setCollapsed: (collapsed: boolean) => void;
  closeMobile: () => void;
};

const AppSidebarContext = createContext<AppSidebarContextValue | null>(null);

export function AppSidebarProvider({ children }: { children: ReactNode }) {
  const collapsed = useSyncExternalStore(
    collapsedStore.subscribe,
    collapsedStore.getSnapshot,
    collapsedStore.getServerSnapshot,
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const setCollapsed = useCallback((next: boolean) => collapsedStore.set(next), []);
  const toggle = useCallback(() => collapsedStore.set(!collapsedStore.getSnapshot()), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const toggleMobile = useCallback(() => setMobileOpen((open) => !open), []);

  const value = useMemo(
    () => ({
      collapsed,
      mobileOpen,
      toggle,
      toggleMobile,
      setCollapsed,
      closeMobile,
    }),
    [collapsed, closeMobile, mobileOpen, setCollapsed, toggle, toggleMobile],
  );

  return <AppSidebarContext.Provider value={value}>{children}</AppSidebarContext.Provider>;
}

export function useAppSidebar() {
  const context = useContext(AppSidebarContext);
  if (!context) {
    throw new Error('useAppSidebar must be used within AppSidebarProvider');
  }
  return context;
}
