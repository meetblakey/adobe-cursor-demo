import { cn } from '@/lib/utils';

export function CampaignDetailPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('overflow-hidden rounded-xl border bg-card', className)}>{children}</div>
  );
}
