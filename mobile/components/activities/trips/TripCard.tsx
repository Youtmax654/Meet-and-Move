import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, XStack, YStack } from "tamagui";

import { Trip } from "../types";
import { AvatarGroup } from "../shared/AvatarGroup";

type TripCardProps = {
  trip: Trip;
};

export function TripCard({ trip }: TripCardProps) {
  const router = useRouter();

  return (
    <YStack
      backgroundColor="#FFFFFF"
      borderRadius={24}
      overflow="hidden"
      marginBottom={20}
      shadowColor="#000"
      shadowOpacity={0.06}
      shadowRadius={10}
      shadowOffset={{ width: 0, height: 4 }}
      elevation={3}
      pressStyle={{ opacity: 0.9, scale: 0.98 }}
      onPress={() => router.push(`/experience/${trip.id}` as any)}
    >
      <YStack position="relative" height={160}>
        <Image
          source={{ uri: trip.coverImage }}
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "cover",
          }}
        />
        <XStack
          position="absolute"
          top={12}
          left={12}
          backgroundColor="rgba(247,246,245,0.92)"
          paddingHorizontal={12}
          paddingVertical={6}
          borderRadius={999}
          alignItems="center"
          gap={6}
        >
          <Ionicons name="checkmark-circle" size={14} color="#B4332A" />
          <Text
            fontSize={10}
            fontWeight="800"
            color="#4338CA"
            letterSpacing={0.5}
          >
            {trip.tag}
          </Text>
        </XStack>
      </YStack>

      <YStack paddingHorizontal={16} paddingVertical={20} gap={12}>
        <XStack justifyContent="space-between" alignItems="flex-start">
          <Text
            fontSize={11}
            color="#B4332A"
            fontWeight="800"
            letterSpacing={1}
            textTransform="uppercase"
          >
            {trip.dateRange}
          </Text>
          <YStack alignItems="flex-end">
            <Text
              fontSize={9}
              color="#8A8F98"
              fontWeight="700"
              letterSpacing={0.8}
              textTransform="uppercase"
            >
              {trip.locationArea}
            </Text>
            <Text fontSize={14} color="#2D3138" fontWeight="800">
              {trip.locationCity}
            </Text>
          </YStack>
        </XStack>

        <YStack gap={6}>
          <Text fontSize={20} lineHeight={24} color="#1F232A" fontWeight="800">
            {trip.title}
          </Text>
          <Text fontSize={13} lineHeight={18} color="#676C74" numberOfLines={2}>
            {trip.description}
          </Text>
        </YStack>

        <XStack
          justifyContent="space-between"
          alignItems="center"
          marginTop={16}
        >
          <AvatarGroup
            avatars={trip.avatars}
            extraCount={trip.extraAvatarsCount}
          />

          <XStack
            backgroundColor="#006666"
            paddingHorizontal={16}
            paddingVertical={12}
            borderRadius={999}
            alignItems="center"
            gap={8}
            onPress={(e) => {
              e.stopPropagation();
              if (trip.chatId) {
                router.push(`/chat/${trip.chatId}` as any);
              }
            }}
            pressStyle={{ opacity: 0.8 }}
          >
            <Text fontSize={13} color="#FFFFFF" fontWeight="700">
              Discussion
            </Text>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={16}
              color="#FFFFFF"
            />
          </XStack>
        </XStack>
      </YStack>
    </YStack>
  );
}
