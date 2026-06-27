import { Badge } from '@/components/ui/badge';
import { approvalBadgeProps } from '@/lib/campaign-status-badges';
import type { CampaignApproval } from '@/lib/campaigns-types';

const STATUS_LABELS: Record<CampaignApproval['status'], string> = {
  pending: 'Pending',
  approved: 'Approved',
};

export function CampaignDetailApprovals({ approvals }: { approvals: CampaignApproval[] }) {
  if (approvals.length === 0) {
    return <p className="text-sm text-muted-foreground">No approval steps for this campaign.</p>;
  }

  return (
    <ul className="divide-y divide-border">
      {approvals.map((approval) => (
        <li key={approval.step} className="flex flex-col gap-1.5 py-3 first:pt-0 last:pb-0">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-medium">{approval.step}</span>
            <Badge {...approvalBadgeProps(approval.status)} className="shrink-0">
              {STATUS_LABELS[approval.status]}
            </Badge>
          </div>
          <span className="text-sm text-muted-foreground">{approval.owner}</span>
          {approval.dueDateLabel ? (
            <span className="text-xs text-muted-foreground">Due {approval.dueDateLabel}</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
