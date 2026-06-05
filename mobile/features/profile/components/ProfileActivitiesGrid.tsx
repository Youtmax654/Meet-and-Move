import { ActivityIndicator, Dimensions, Image, Pressable } from "react-native";
import { Text, XStack, YStack } from "tamagui";

import type { UserActivity } from "@/features/profile/schemas/profile.schema";

type ProfileActivitiesGridProps = {
  activities: UserActivity[];
  isLoading: boolean;
  isError: boolean;
  onPressActivity: (activityId: string) => void;
};

export function ProfileActivitiesGrid({
  activities,
  isLoading,
  isError,
  onPressActivity,
}: ProfileActivitiesGridProps) {
  const gridItemSize = getGridItemSize();
  const count = activities.length;

  return (
    <YStack gap={12} paddingBottom={40}>
      <XStack alignItems="center" justifyContent="space-between">
        <Text fontSize={18} fontWeight="800" color="#1E2228">
          Activités
        </Text>
        <Text fontSize={12} color="#5B5C5B">
          {count} {count > 1 ? "activités créées" : "activité créée"}
        </Text>
      </XStack>

      {isLoading ? (
        <YStack alignItems="center" justifyContent="center" py={16}>
          <ActivityIndicator size="small" color="#006666" />
        </YStack>
      ) : null}

      {isError ? (
        <Text fontSize={13} color="#5B5C5B">
          Impossible de charger les activités.
        </Text>
      ) : null}

      {!isLoading && !isError && count === 0 ? (
        <Text fontSize={13} color="#5B5C5B">
          Aucune activité pour le moment.
        </Text>
      ) : null}

      <XStack flexWrap="wrap" gap={8}>
        {activities.map((activity) => {
          const dateLabel = formatActivityDate(activity.eventDate);
          const cityLabel = activity.locationCity || "";
          const categoryLabel = activity.category?.name || "";

          const imageUri = `${process.env.EXPO_PUBLIC_API_URL}/activities/${activity.id}/image`;

          return (
            <Pressable
              key={activity.id}
              onPress={() => onPressActivity(activity.id)}
              style={{ width: gridItemSize, height: gridItemSize }}
            >
              <YStack
                width={gridItemSize}
                height={gridItemSize}
                borderRadius={18}
                overflow="hidden"
                backgroundColor="#E2E2E1"
                position="relative"
              >
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
                <XStack
                  position="absolute"
                  top={8}
                  left={8}
                  right={8}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  {categoryLabel ? (
                    <YStack
                      backgroundColor="rgba(247,246,245,0.9)"
                      borderRadius={999}
                      px={8}
                      py={4}
                      maxWidth="60%"
                    >
                      <Text fontSize={10} fontWeight="700" color="#2E2F2F">
                        {categoryLabel}
                      </Text>
                    </YStack>
                  ) : (
                    <YStack />
                  )}
                  {dateLabel ? (
                    <YStack
                      backgroundColor="rgba(0,0,0,0.55)"
                      borderRadius={999}
                      px={8}
                      py={4}
                    >
                      <Text fontSize={10} fontWeight="700" color="#FFFFFF">
                        {dateLabel}
                      </Text>
                    </YStack>
                  ) : null}
                </XStack>
                <YStack
                  position="absolute"
                  left={0}
                  right={0}
                  bottom={0}
                  padding={8}
                  backgroundColor="rgba(0,0,0,0.45)"
                >
                  <Text
                    fontSize={12}
                    fontWeight="700"
                    color="#FFFFFF"
                    numberOfLines={1}
                  >
                    {activity.title}
                  </Text>
                  {cityLabel ? (
                    <Text
                      fontSize={10}
                      fontWeight="600"
                      color="#F0F0F0"
                      numberOfLines={1}
                    >
                      {cityLabel}
                    </Text>
                  ) : null}
                </YStack>
              </YStack>
            </Pressable>
          );
        })}
      </XStack>
    </YStack>
  );
}

function getGridItemSize() {
  const screenWidth = Dimensions.get("window").width;
  const horizontalPadding = 16 * 2;
  const gap = 8;
  return Math.floor((screenWidth - horizontalPadding - gap) / 2);
}

function formatActivityDate(value: Date | null | undefined) {
  if (!value) return "";
  return value.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}
