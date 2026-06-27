const updatedAtFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export function formatCampaignUpdatedAt(isoDate: string): string {
  return formatCampaignDate(isoDate);
}

export function formatCampaignDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return updatedAtFormatter.format(parsed);
}

export function formatCampaignDateRange(startDate: string, endDate: string): string {
  return `${formatCampaignDate(startDate)} – ${formatCampaignDate(endDate)}`;
}

export function getOwnerInitials(owner: string): string {
  return owner
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
