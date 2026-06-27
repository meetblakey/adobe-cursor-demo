'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const TAB_ITEMS = [
  { value: 'overview', label: 'Overview' },
  { value: 'channels', label: 'Channels' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'assets', label: 'Assets' },
  { value: 'activity', label: 'Activity' },
] as const;

type CampaignDetailTabsProps = {
  overview: React.ReactNode;
  channels: React.ReactNode;
  timeline: React.ReactNode;
  assets: React.ReactNode;
  activity: React.ReactNode;
};

const TAB_CONTENT: Record<(typeof TAB_ITEMS)[number]['value'], keyof CampaignDetailTabsProps> = {
  overview: 'overview',
  channels: 'channels',
  timeline: 'timeline',
  assets: 'assets',
  activity: 'activity',
};

export function CampaignDetailTabs(props: CampaignDetailTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full min-w-0 gap-0">
      <div className="border-b border-border pb-3">
        <TabsList
          variant="default"
          className="h-10 w-full justify-start gap-0.5 overflow-x-auto p-1 sm:h-9 sm:w-fit sm:max-w-full [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TAB_ITEMS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                'h-8 shrink-0 flex-none px-3.5 text-sm font-medium sm:h-7',
                'text-muted-foreground hover:bg-background/60 hover:text-foreground',
                'data-active:bg-primary/10 data-active:text-primary',
                'data-active:ring-1 data-active:ring-inset data-active:ring-primary/20',
                'data-active:shadow-none',
                'dark:data-active:bg-primary/15 dark:data-active:text-primary',
              )}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {TAB_ITEMS.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="pt-5 focus-visible:outline-none">
          {props[TAB_CONTENT[tab.value]]}
        </TabsContent>
      ))}
    </Tabs>
  );
}
