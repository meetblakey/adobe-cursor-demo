import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getOwnerInitials } from '@/lib/campaigns-format';
import type { CampaignStakeholder } from '@/lib/campaigns-types';

export function CampaignDetailStakeholders({
  stakeholders,
}: {
  stakeholders: CampaignStakeholder[];
}) {
  if (stakeholders.length === 0) {
    return <p className="text-sm text-muted-foreground">No stakeholders assigned.</p>;
  }

  return (
    <ul className="divide-y divide-border">
      {stakeholders.map((person) => (
        <li key={person.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <Avatar size="sm">
            <AvatarFallback>{getOwnerInitials(person.name)}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate text-sm font-medium">{person.name}</span>
            <span className="text-xs text-muted-foreground">
              {person.role} · {person.team}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
