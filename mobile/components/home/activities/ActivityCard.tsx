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

function formatDate(date: Date | null): string {
  if (!date) return "Date à confirmer";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || price === 0) return "Gratuit";
  return `${price}€`;
}

function buildLocationLabel(activity: Activity): string {
  const parts: string[] = [];
  if (activity.distance != null) parts.push(formatDistance(activity.distance));
  if (activity.locationCity) parts.push(activity.locationCity);
  if (parts.length > 0) return parts.join(" • ");
  return activity.host.name;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const router = useRouter();

  const avatarImages = activity.participants
    .filter((p) => p.image)
    .slice(0, 3)
    .map((p) => p.image as string);

  const extraCount = activity.enrolledCount - avatarImages.length;
  const extra = extraCount > 0 ? `+${extraCount}` : `+0`;

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
              {formatDate(activity.eventDate)}
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
                {buildLocationLabel(activity)}
              </Text>
              {activity.host.emailVerified && (
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
            <AvatarGroup avatars={avatarImages} extra={extra} />
            <Text fontSize={18} fontWeight="800" color="#4953AC">
              {formatPrice(activity.price)}
            </Text>
          </XStack>
        </YStack>
      </YStack>
    </Pressable>
  );
}
