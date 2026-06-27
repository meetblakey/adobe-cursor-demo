'use client';

import { Select } from '@base-ui/react/select';
import { cn } from '@/lib/utils';

const ITEMS = [
  { value: 'all', label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'live', label: 'Live' },
  { value: 'review', label: 'In review' },
];

export function StatusFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select.Root items={ITEMS} value={value} onValueChange={(v) => onChange(v as string)}>
      <Select.Trigger
        aria-label="Filter by status"
        className={cn(
          'inline-flex h-9 w-auto min-w-[9rem] shrink-0 items-center justify-between gap-2 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:bg-muted',
        )}
      >
        <Select.Value />
        <Select.Icon className="text-muted-foreground">▾</Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={6} className="z-50 outline-none">
          <Select.Popup className="min-w-44 rounded-lg border bg-popover p-1 text-popover-foreground shadow-md outline-none">
            {ITEMS.map((item) => (
              <Select.Item
                key={item.value}
                value={item.value}
                className="flex cursor-default items-center gap-2 rounded-md py-1.5 pr-2 pl-7 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
              >
                <Select.ItemIndicator className="absolute left-2">✓</Select.ItemIndicator>
                <Select.ItemText>{item.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
