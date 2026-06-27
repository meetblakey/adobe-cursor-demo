import type { AssetStatus, ApprovalStatus, ChannelPlanStatus } from '@/lib/campaigns-types';

type BadgeVariant = 'default' | 'secondary' | 'outline';

export function channelPlanBadgeProps(status: ChannelPlanStatus): {
  variant: BadgeVariant;
  className?: string;
} {
  switch (status) {
    case 'live':
      return { variant: 'secondary' };
    case 'in_review':
      return { variant: 'outline', className: 'text-muted-foreground' };
    default:
      return { variant: 'outline', className: 'text-muted-foreground' };
  }
}

export function assetBadgeProps(status: AssetStatus): {
  variant: BadgeVariant;
  className?: string;
} {
  switch (status) {
    case 'approved':
      return { variant: 'secondary' };
    case 'in_review':
      return { variant: 'outline', className: 'text-muted-foreground' };
    default:
      return { variant: 'outline', className: 'text-muted-foreground' };
  }
}

export function approvalBadgeProps(status: ApprovalStatus): {
  variant: BadgeVariant;
  className?: string;
} {
  switch (status) {
    case 'approved':
      return { variant: 'secondary' };
    default:
      return { variant: 'outline', className: 'text-muted-foreground' };
  }
}
