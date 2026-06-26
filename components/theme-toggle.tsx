'use client';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <Button variant="outline" size="sm" onClick={toggle}>
      {theme === 'light' ? 'Dark' : 'Light'} mode
    </Button>
  );
}
