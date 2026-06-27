import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getOwnerInitials } from '@/lib/campaigns-format';

export function CampaignOwnerAvatar({ owner }: { owner: string }) {
  return (
    <Avatar size="sm">
      <AvatarFallback>{getOwnerInitials(owner)}</AvatarFallback>
    </Avatar>
  );
}
