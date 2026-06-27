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
    <ul className="flex flex-col gap-3">
      {approvals.map((approval) => (
        <li
          key={approval.step}
          className="flex flex-col gap-1 rounded-lg border px-3 py-2 text-sm"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium">{approval.step}</span>
            <Badge {...approvalBadgeProps(approval.status)}>
              {STATUS_LABELS[approval.status]}
            </Badge>
          </div>
          <span className="text-muted-foreground">{approval.owner}</span>
          {approval.dueDateLabel ? (
            <span className="text-xs text-muted-foreground">Due {approval.dueDateLabel}</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
