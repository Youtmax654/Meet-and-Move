import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Text, XStack, YStack } from "tamagui";

import { AvatarGroup } from "@/components/home/activities/AvatarGroup";
import type { Activity } from "@/features/home/schemas/feed.schema";

type ActivityCardProps = {
  activity: Activity;
};

export function ActivityCard({ activity }: ActivityCardProps) {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push(`/experience/${activity.id}`)}>
      <YStack
        width={280}
        height={350}
        borderRadius={24}
        backgroundColor="#FFFFFF"
        shadowColor="#000"
        shadowOpacity={0.05}
        shadowRadius={2}
        shadowOffset={{ width: 0, height: 1 }}
        elevation={3}
        overflow="hidden"
      >
        <YStack position="relative" height={192}>
          <Image
            source={{ uri: activity.image }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              resizeMode: "cover",
            }}
          />
          <XStack
            position="absolute"
            top={16}
            left={16}
            borderRadius={9999}
            paddingHorizontal={12}
            paddingVertical={4}
            backgroundColor="rgba(247,246,245,0.8)"
          >
            <Text fontSize={12} color="#2E2F2E" fontWeight="600">
              {activity.date}
            </Text>
          </XStack>
        </YStack>

        <YStack
          paddingHorizontal={20}
          paddingTop={19}
          paddingBottom={32}
          flex={1}
        >
          <YStack gap={8} height={75}>
            <Text
              fontSize={18}
              lineHeight={22.5}
              color="#2E2F2E"
              fontWeight="700"
              numberOfLines={2}
            >
              {activity.title}
            </Text>

            <XStack alignItems="center" gap={8}>
              <Text fontSize={14} color="#5B5C5B" fontWeight="500">
                {activity.location}
              </Text>
              {activity.isHostVerified && (
                <Ionicons name="checkmark-circle" size={16} color="#006666" />
              )}
            </XStack>
          </YStack>

          <XStack
            justifyContent="space-between"
            alignItems="center"
            paddingTop={12}
            marginTop="auto"
          >
            <AvatarGroup avatars={activity.avatars} extra={activity.extra} />
            <Text fontSize={18} fontWeight="800" color="#4953AC">
              {activity.price}
              {!String(activity.price).includes("€") ? "€" : ""}
            </Text>
          </XStack>
        </YStack>
      </YStack>
    </Pressable>
  );
}
