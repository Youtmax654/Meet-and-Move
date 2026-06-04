import { ActivityIndicator, FlatList, View } from "react-native";
import { YStack } from "tamagui";

import { ActivityCard } from "@/components/home/activities/ActivityCard";
import { SectionHeader } from "@/components/home/shared/SectionHeader";
import type { Activity } from "@/features/home/schemas/feed.schema";

type ActivitiesSectionProps = {
  activities: Activity[];
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
};

export function ActivitiesSection({
  activities,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: ActivitiesSectionProps) {
  return (
    <YStack>
      <SectionHeader title="Activités" actionLabel="Voir tout" />
      <FlatList
        horizontal
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ActivityCard activity={item} />}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        contentContainerStyle={{ paddingRight: 12, marginBottom: 22 }}
        showsHorizontalScrollIndicator={false}
        onEndReached={hasMore ? onLoadMore : undefined}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={{ width: 60, alignItems: "center", justifyContent: "center" }}>
              <ActivityIndicator size="small" color="#008A87" />
            </View>
          ) : null
        }
      />
    </YStack>
  );
}
