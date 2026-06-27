import type { CampaignStatus } from '@/components/ui/status-badge';

export type Campaign = {
  id: string;
  slug: string;
  name: string;
  owner: string;
  status: CampaignStatus;
  updatedAt: string;
  updatedAtLabel: string;
  summary: string;
  channels: string[];
  campaignType: string;
  coverImage: string;
};

export type MilestoneStatus = 'complete' | 'current' | 'upcoming';

export type ChannelPlanStatus = 'draft' | 'scheduled' | 'live' | 'in_review';

export type AssetStatus = 'draft' | 'in_review' | 'approved';

export type ApprovalStatus = 'pending' | 'approved';

export type CampaignMilestone = {
  label: string;
  date: string;
  dateLabel: string;
  status: MilestoneStatus;
};

export type CampaignChannelPlan = {
  channel: string;
  status: ChannelPlanStatus;
  note: string;
};

export type CampaignAsset = {
  name: string;
  type: string;
  status: AssetStatus;
};

export type CampaignStakeholder = {
  name: string;
  role: string;
  team: string;
};

export type CampaignApproval = {
  step: string;
  owner: string;
  status: ApprovalStatus;
  dueDate?: string;
  dueDateLabel?: string;
};

export type CampaignActivity = {
  at: string;
  atLabel: string;
  actor: string;
  action: string;
};

export type CampaignDetail = Campaign & {
  objective: string;
  audience: string;
  keyMessage: string;
  startDate: string;
  endDate: string;
  startDateLabel: string;
  endDateLabel: string;
  milestones: CampaignMilestone[];
  channelPlan: CampaignChannelPlan[];
  assets: CampaignAsset[];
  stakeholders: CampaignStakeholder[];
  approvals: CampaignApproval[];
  activity: CampaignActivity[];
};
