import { ScrollView } from "react-native";
import { XStack, YStack } from "tamagui";

import { ActivityCard } from "@/components/home/activities/ActivityCard";
import { SectionHeader } from "@/components/home/shared/SectionHeader";
import type { Activity } from "@/features/home/schemas/feed.schema";

type ActivitiesSectionProps = {
  activities: Activity[];
};

export function ActivitiesSection({ activities }: ActivitiesSectionProps) {
  return (
    <YStack>
      <SectionHeader title="Activités" actionLabel="Voir tout" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 12, gap: 12, marginBottom: 22 }}
      >
        <XStack gap={24}>
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </XStack>
      </ScrollView>
    </YStack>
  );
}
