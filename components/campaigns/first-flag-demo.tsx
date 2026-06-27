'use client';

import { useFlags } from 'launchdarkly-react-client-sdk';
import { StatusBadge } from '@/components/ui/status-badge';

export function FirstFlagDemo() {
  const { myFirstFlag } = useFlags();
  const enabled = Boolean(myFirstFlag);

  return (
    <section
      aria-live="polite"
      className="mt-6 rounded-lg border border-border bg-card p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium text-foreground">LaunchDarkly first flag</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Toggle <code className="text-xs">my-first-flag</code> in the dashboard to see this
            update live.
          </p>
        </div>
        <StatusBadge status={enabled ? 'live' : 'draft'} />
      </div>
      <p className="mt-3 text-sm text-foreground">
        {enabled
          ? 'Feature is ON — the flag is serving true for your context.'
          : 'Feature is OFF — the flag is serving false (default).'}
      </p>
    </section>
  );
}
