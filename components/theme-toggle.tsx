'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isLight = theme === 'light';

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn('size-8 shrink-0', className)}
      onClick={toggle}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {isLight ? <MoonIcon aria-hidden /> : <SunIcon aria-hidden />}
    </Button>
  );
}
