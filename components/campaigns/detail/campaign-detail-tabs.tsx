'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type CampaignDetailTabsProps = {
  overview: React.ReactNode;
  channels: React.ReactNode;
  timeline: React.ReactNode;
  assets: React.ReactNode;
  activity: React.ReactNode;
};

export function CampaignDetailTabs({
  overview,
  channels,
  timeline,
  assets,
  activity,
}: CampaignDetailTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList variant="line" className="h-auto w-full justify-start gap-4">
        <TabsTrigger value="overview" className="flex-none px-0">
          Overview
        </TabsTrigger>
        <TabsTrigger value="channels" className="flex-none px-0">
          Channels
        </TabsTrigger>
        <TabsTrigger value="timeline" className="flex-none px-0">
          Timeline
        </TabsTrigger>
        <TabsTrigger value="assets" className="flex-none px-0">
          Assets
        </TabsTrigger>
        <TabsTrigger value="activity" className="flex-none px-0">
          Activity
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="pt-4">
        {overview}
      </TabsContent>
      <TabsContent value="channels" className="pt-4">
        {channels}
      </TabsContent>
      <TabsContent value="timeline" className="pt-4">
        {timeline}
      </TabsContent>
      <TabsContent value="assets" className="pt-4">
        {assets}
      </TabsContent>
      <TabsContent value="activity" className="pt-4">
        {activity}
      </TabsContent>
    </Tabs>
  );
}
