import { formatCampaignDate } from '@/lib/campaigns-format';
import type {
  CampaignApproval,
  CampaignAsset,
  CampaignActivity,
  CampaignChannelPlan,
  CampaignMilestone,
  CampaignStakeholder,
} from '@/lib/campaigns-types';

type DetailSeed = {
  objective: string;
  audience: string;
  keyMessage: string;
  startDate: string;
  endDate: string;
  milestones: Array<Omit<CampaignMilestone, 'dateLabel'>>;
  channelPlan: CampaignChannelPlan[];
  assets: CampaignAsset[];
  stakeholders: CampaignStakeholder[];
  approvals: Array<Omit<CampaignApproval, 'dueDateLabel'>>;
  activity: Array<Omit<CampaignActivity, 'atLabel'>>;
};

function enrichDetail(seed: DetailSeed) {
  return {
    ...seed,
    startDateLabel: formatCampaignDate(seed.startDate),
    endDateLabel: formatCampaignDate(seed.endDate),
    milestones: seed.milestones.map((m) => ({
      ...m,
      dateLabel: formatCampaignDate(m.date),
    })),
    approvals: seed.approvals.map((a) => ({
      ...a,
      dueDateLabel: a.dueDate ? formatCampaignDate(a.dueDate) : undefined,
    })),
    activity: seed.activity.map((e) => ({
      ...e,
      atLabel: formatCampaignDate(e.at),
    })),
  };
}

/** Canonical detail narrative — keep supabase/migrations/0003 backfill in sync. */
export const CAMPAIGN_DETAIL_SEED: Record<string, ReturnType<typeof enrichDetail>> = {
  'summer-launch': enrichDetail({
    objective:
      'Drive adoption of seasonal Creative Cloud features across digital surfaces during the peak summer creative season. Coordinate in-app prompts, email nurture, and web landing pages so product marketing and growth teams ship a unified GTM story.',
    audience: 'Existing Creative Cloud subscribers and trial users in NA and EMEA who engage with photography and video workflows.',
    keyMessage: 'Create more this summer with new AI-powered tools built for how you work.',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    milestones: [
      { label: 'Creative brief approved', date: '2026-05-15', status: 'complete' },
      { label: 'In-app surfaces live', date: '2026-06-10', status: 'complete' },
      { label: 'Email wave 2', date: '2026-07-08', status: 'current' },
      { label: 'Mid-season performance review', date: '2026-07-22', status: 'upcoming' },
      { label: 'Campaign wrap report', date: '2026-09-05', status: 'upcoming' },
    ],
    channelPlan: [
      { channel: 'In-app', status: 'live', note: 'Home module hero and feature discovery cards.' },
      { channel: 'Email', status: 'live', note: 'Wave 1 sent; wave 2 scheduled for trial segment.' },
      { channel: 'Web', status: 'scheduled', note: 'Landing page refresh pending final copy.' },
    ],
    assets: [
      { name: 'Summer hero banner', type: 'Image', status: 'approved' },
      { name: 'In-app modal copy', type: 'Copy', status: 'approved' },
      { name: 'Email template v2', type: 'Email', status: 'in_review' },
      { name: 'Social cut-downs', type: 'Video', status: 'draft' },
    ],
    stakeholders: [
      { name: 'Maya Chen', role: 'Campaign lead', team: 'Growth' },
      { name: 'Jordan Lee', role: 'Product marketing', team: 'Creative Cloud' },
      { name: 'Sam Ortiz', role: 'Design', team: 'Pigment' },
    ],
    approvals: [
      { step: 'Brand review', owner: 'Brand studio', status: 'approved' },
      { step: 'Legal copy check', owner: 'Legal', status: 'approved' },
    ],
    activity: [
      { at: '2026-06-24', actor: 'Maya Chen', action: 'Marked in-app surfaces as live.' },
      { at: '2026-06-20', actor: 'Jordan Lee', action: 'Updated email wave 2 audience segment.' },
      { at: '2026-06-18', actor: 'Sam Ortiz', action: 'Uploaded approved hero banner assets.' },
    ],
  }),

  'brand-refresh-2026': enrichDetail({
    objective:
      'Roll out the 2026 Pigment visual identity across 200+ internal product surfaces so every Adobe team ships consistent typography, color, and component patterns. This is the platform team’s flagship cross-product coordination effort.',
    audience: 'Internal product and design teams consuming the Pigment design system across Creative Cloud, Document Cloud, and Experience Cloud.',
    keyMessage: 'One design system, every surface: ship the refresh together.',
    startDate: '2026-05-01',
    endDate: '2026-12-31',
    milestones: [
      { label: 'Token package v2 published', date: '2026-05-20', status: 'complete' },
      { label: 'Pilot surfaces migrated', date: '2026-06-15', status: 'complete' },
      { label: 'Org-wide rollout kickoff', date: '2026-07-01', status: 'current' },
      { label: 'Compliance audit', date: '2026-09-30', status: 'upcoming' },
      { label: 'Refresh complete', date: '2026-12-15', status: 'upcoming' },
    ],
    channelPlan: [
      { channel: 'Design system', status: 'live', note: 'Figma libraries and token docs updated.' },
      { channel: 'In-app', status: 'in_review', note: 'Component swaps staged in 12 pilot apps.' },
    ],
    assets: [
      { name: 'Token migration guide', type: 'Doc', status: 'approved' },
      { name: 'Component parity checklist', type: 'Doc', status: 'in_review' },
      { name: 'Launch town hall deck', type: 'Slide', status: 'in_review' },
      { name: 'Before/after screenshots', type: 'Image', status: 'draft' },
    ],
    stakeholders: [
      { name: 'Alex Rivera', role: 'Design system lead', team: 'Design' },
      { name: 'Priya Nair', role: 'Engineering partner', team: 'Platform' },
      { name: 'Chris Wu', role: 'Program manager', team: 'Design' },
    ],
    approvals: [
      { step: 'Executive sponsor sign-off', owner: 'Design leadership', status: 'pending', dueDate: '2026-06-28' },
      { step: 'Accessibility audit', owner: 'A11y guild', status: 'pending', dueDate: '2026-07-05' },
      { step: 'Pilot surface review', owner: 'Product councils', status: 'approved' },
    ],
    activity: [
      { at: '2026-06-23', actor: 'Alex Rivera', action: 'Submitted rollout deck for executive review.' },
      { at: '2026-06-21', actor: 'Priya Nair', action: 'Flagged 3 pilot apps blocked on token sync.' },
      { at: '2026-06-19', actor: 'Chris Wu', action: 'Scheduled org-wide kickoff for July 1.' },
    ],
  }),

  'apj-expansion': enrichDetail({
    objective:
      'Launch an enterprise trial go-to-market motion for APJ field teams. Align field events, localized email, and sales enablement so regional reps can run a consistent trial narrative for large accounts.',
    audience: 'Enterprise prospects and field sellers in Japan, ANZ, and Southeast Asia evaluating Adobe Experience Cloud.',
    keyMessage: 'Start your enterprise trial with APJ field support from day one.',
    startDate: '2026-07-01',
    endDate: '2026-09-30',
    milestones: [
      { label: 'Regional messaging workshop', date: '2026-06-05', status: 'complete' },
      { label: 'Field kit published', date: '2026-06-25', status: 'current' },
      { label: 'Tokyo kickoff event', date: '2026-07-15', status: 'upcoming' },
      { label: 'Pipeline review', date: '2026-08-20', status: 'upcoming' },
    ],
    channelPlan: [
      { channel: 'Field events', status: 'scheduled', note: 'Tokyo and Sydney events booked.' },
      { channel: 'Email', status: 'draft', note: 'Localized templates in review with regional PMM.' },
    ],
    assets: [
      { name: 'APJ trial one-pager', type: 'PDF', status: 'in_review' },
      { name: 'Field talk track', type: 'Doc', status: 'draft' },
      { name: 'Event booth creative', type: 'Image', status: 'draft' },
    ],
    stakeholders: [
      { name: 'Kenji Tanaka', role: 'Regional PMM', team: 'Field' },
      { name: 'Lina Park', role: 'Sales enablement', team: 'Field' },
      { name: 'Dev Singh', role: 'Events', team: 'Field' },
    ],
    approvals: [
      { step: 'Regional legal review', owner: 'APJ Legal', status: 'pending', dueDate: '2026-06-30' },
    ],
    activity: [
      { at: '2026-06-22', actor: 'Kenji Tanaka', action: 'Shared draft trial one-pager for feedback.' },
      { at: '2026-06-18', actor: 'Lina Park', action: 'Added talk track outline to field kit.' },
    ],
  }),

  'acrobat-ai-upsell': enrichDetail({
    objective:
      'Upgrade existing Document Cloud subscribers to the Acrobat AI tier through in-product prompts, targeted email, and paid social retargeting. Focus on subscribers who already use PDF workflows weekly.',
    audience: 'Active Acrobat subscribers in NA who have not yet enabled AI assistant features.',
    keyMessage: 'Your documents, supercharged: try Acrobat AI on the plan you already trust.',
    startDate: '2026-06-01',
    endDate: '2026-07-31',
    milestones: [
      { label: 'Upsell creative approved', date: '2026-05-28', status: 'complete' },
      { label: 'In-app prompt live', date: '2026-06-08', status: 'complete' },
      { label: 'Paid social flight 1', date: '2026-06-15', status: 'complete' },
      { label: 'Email retargeting wave', date: '2026-06-25', status: 'current' },
    ],
    channelPlan: [
      { channel: 'In-app', status: 'live', note: 'Contextual upsell on save and export flows.' },
      { channel: 'Email', status: 'live', note: 'Segmented by AI feature usage.' },
      { channel: 'Paid social', status: 'live', note: 'LinkedIn and Meta retargeting active.' },
    ],
    assets: [
      { name: 'In-app upsell modal', type: 'Copy', status: 'approved' },
      { name: 'Email upgrade template', type: 'Email', status: 'approved' },
      { name: 'Paid social static set', type: 'Image', status: 'approved' },
    ],
    stakeholders: [
      { name: 'Riley Morgan', role: 'Lifecycle PMM', team: 'Document Cloud' },
      { name: 'Aisha Khan', role: 'Growth', team: 'Document Cloud' },
      { name: 'Tom Becker', role: 'Paid media', team: 'Growth' },
    ],
    approvals: [
      { step: 'Pricing disclosure review', owner: 'Legal', status: 'approved' },
      { step: 'Product capability claims', owner: 'PM Legal', status: 'approved' },
    ],
    activity: [
      { at: '2026-06-21', actor: 'Riley Morgan', action: 'Launched email retargeting for non-AI users.' },
      { at: '2026-06-17', actor: 'Tom Becker', action: 'Increased paid social budget for flight 1.' },
      { at: '2026-06-12', actor: 'Aisha Khan', action: 'Confirmed in-app prompt conversion tracking.' },
    ],
  }),

  'firefly-holiday-push': enrichDetail({
    objective:
      'Build holiday-season awareness and trial activation for Firefly generative AI. Coordinate social, email, and web surfaces so Creative Cloud teams can capture seasonal demand without conflicting messages.',
    audience: 'Creative professionals and hobbyists interested in generative AI for holiday content creation.',
    keyMessage: 'Make holiday magic with Firefly: generate, refine, and share in minutes.',
    startDate: '2026-11-01',
    endDate: '2026-12-31',
    milestones: [
      { label: 'Holiday creative concepts', date: '2026-08-15', status: 'upcoming' },
      { label: 'Trial landing page', date: '2026-09-30', status: 'upcoming' },
      { label: 'Social flight prep', date: '2026-10-15', status: 'upcoming' },
      { label: 'Campaign launch', date: '2026-11-01', status: 'upcoming' },
    ],
    channelPlan: [
      { channel: 'Social', status: 'draft', note: 'Concept boards in creative review.' },
      { channel: 'Email', status: 'draft', note: 'Trial nurture sequence outline started.' },
      { channel: 'Web', status: 'in_review', note: 'Landing page wireframes with brand.' },
    ],
    assets: [
      { name: 'Holiday concept moodboard', type: 'Image', status: 'in_review' },
      { name: 'Trial LP wireframe', type: 'Design', status: 'in_review' },
      { name: 'Social copy bank', type: 'Copy', status: 'draft' },
    ],
    stakeholders: [
      { name: 'Elena Vasquez', role: 'Brand PMM', team: 'Creative Cloud' },
      { name: 'Marcus Holt', role: 'Social lead', team: 'Creative Cloud' },
      { name: 'Yuki Sato', role: 'Web PMM', team: 'Creative Cloud' },
    ],
    approvals: [
      { step: 'Generative AI disclosure', owner: 'Legal', status: 'pending', dueDate: '2026-07-10' },
      { step: 'Brand holiday guidelines', owner: 'Brand studio', status: 'pending', dueDate: '2026-07-15' },
      { step: 'Trial offer terms', owner: 'Revenue ops', status: 'pending', dueDate: '2026-07-20' },
    ],
    activity: [
      { at: '2026-06-20', actor: 'Elena Vasquez', action: 'Shared holiday concept deck for brand review.' },
      { at: '2026-06-17', actor: 'Marcus Holt', action: 'Drafted social flight calendar.' },
      { at: '2026-06-15', actor: 'Yuki Sato', action: 'Posted LP wireframes for stakeholder feedback.' },
    ],
  }),

  'enterprise-onboarding': enrichDetail({
    objective:
      'Enable Experience Cloud admin onboarding for new enterprise tenants. Provide email drips, in-app checklists, and sales enablement so customer success can activate admins within the first 30 days.',
    audience: 'Newly provisioned Experience Cloud tenant administrators and their internal champions.',
    keyMessage: 'Get your tenant production-ready in 30 days with guided onboarding.',
    startDate: '2026-06-15',
    endDate: '2026-10-31',
    milestones: [
      { label: 'Onboarding journey mapped', date: '2026-05-30', status: 'complete' },
      { label: 'Admin checklist beta', date: '2026-06-20', status: 'current' },
      { label: 'CS playbook published', date: '2026-07-15', status: 'upcoming' },
      { label: 'GA rollout', date: '2026-08-01', status: 'upcoming' },
    ],
    channelPlan: [
      { channel: 'Email', status: 'scheduled', note: '7-touch drip sequence built, pending legal.' },
      { channel: 'In-app', status: 'draft', note: 'Admin checklist UI in beta on 3 tenants.' },
      { channel: 'Sales enablement', status: 'draft', note: 'CS talk track and FAQ in progress.' },
    ],
    assets: [
      { name: 'Admin checklist spec', type: 'Doc', status: 'in_review' },
      { name: 'Welcome email series', type: 'Email', status: 'draft' },
      { name: 'CS onboarding playbook', type: 'Doc', status: 'draft' },
    ],
    stakeholders: [
      { name: 'Nina Patel', role: 'Customer success', team: 'Experience Cloud' },
      { name: 'Omar Hassan', role: 'Product marketing', team: 'Experience Cloud' },
      { name: 'Grace Kim', role: 'UX writer', team: 'Experience Cloud' },
    ],
    approvals: [
      { step: 'Tenant data handling review', owner: 'Security', status: 'pending', dueDate: '2026-06-29' },
    ],
    activity: [
      { at: '2026-06-19', actor: 'Nina Patel', action: 'Started beta checklist with 3 pilot tenants.' },
      { at: '2026-06-16', actor: 'Grace Kim', action: 'Revised in-app checklist microcopy.' },
    ],
  }),
};

export function getDetailSeedBySlug(slug: string) {
  return CAMPAIGN_DETAIL_SEED[slug];
}
