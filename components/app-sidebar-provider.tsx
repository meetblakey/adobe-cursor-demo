'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'pigment-studio-sidebar-collapsed';

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
  const [collapsed, setCollapsedState] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setCollapsedState(window.localStorage.getItem(STORAGE_KEY) === 'true');
    } catch {
      // ignore storage errors
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const setCollapsed = useCallback((next: boolean) => {
    setCollapsedState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggle = useCallback(() => {
    setCollapsedState((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const toggleMobile = useCallback(() => setMobileOpen((open) => !open), []);

  const value = useMemo(
    () => ({
      collapsed: ready ? collapsed : false,
      mobileOpen,
      toggle,
      toggleMobile,
      setCollapsed,
      closeMobile,
    }),
    [collapsed, closeMobile, mobileOpen, ready, setCollapsed, toggle, toggleMobile],
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
