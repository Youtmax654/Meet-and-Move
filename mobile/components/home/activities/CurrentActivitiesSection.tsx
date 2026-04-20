import { ScrollView } from "react-native";
import { XStack, YStack } from "tamagui";

import { SectionHeader } from "@/components/home/shared/SectionHeader";
import type { Activity } from "@/features/home/schemas/feed.schema";
import { ActivityCard } from "./ActivityCard";

type CurrentActivitiesSectionProps = {
  currentActivities: Activity[];
};

export function CurrentActivitiesSection({
  currentActivities,
}: CurrentActivitiesSectionProps) {
  return (
    <YStack>
      <SectionHeader title="Activités en cours" actionLabel="Voir tout" />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 12, gap: 12, marginBottom: 22 }}
      >
        <XStack gap={24}>
          {currentActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </XStack>
      </ScrollView>
    </YStack>
  );
}
