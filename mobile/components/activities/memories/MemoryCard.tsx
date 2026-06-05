import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Text, XStack, YStack } from "tamagui";

import { Memory } from "@/components/activities/types";

type MemoryCardProps = {
  memory: Memory;
  layout?: "horizontal" | "vertical";
};

export function MemoryCard({ memory, layout = "vertical" }: MemoryCardProps) {
  const isHorizontal = layout === "horizontal";

  const imageUri = `${process.env.EXPO_PUBLIC_API_URL}/activities/${memory.id}/image`;

  return (
    <YStack
      width={isHorizontal ? 220 : "100%"}
      backgroundColor="#FFFFFF"
      borderRadius={22}
      overflow="hidden"
      shadowColor="#0A0A0A"
      shadowOpacity={0.06}
      shadowRadius={10}
      shadowOffset={{ width: 0, height: 4 }}
      elevation={3}
      marginRight={isHorizontal ? 16 : 0}
    >
      <YStack position="relative" height={isHorizontal ? 140 : 160}>
        <Image
          source={{ uri: imageUri }}
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "cover",
            borderTopLeftRadius: 22,
            borderTopRightRadius: 22,
          }}
        />

        <YStack
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          height="40%"
          backgroundColor="transparent"
        />

        <XStack
          position="absolute"
          bottom={10}
          left={10}
          backgroundColor="rgba(0,0,0,0.4)"
          paddingHorizontal={10}
          paddingVertical={4}
          borderRadius={8}
        >
          <Text fontSize={10} color="#FFFFFF" fontWeight="700">
            {memory.dateBadge}
          </Text>
        </XStack>
      </YStack>

      <YStack padding={14} gap={14}>
        <YStack gap={2}>
          <Text
            fontSize={15}
            color="#4338CA"
            fontWeight="800"
            numberOfLines={1}
          >
            {memory.title}
          </Text>
          <Text
            fontSize={11}
            color="#6B7280"
            fontWeight="500"
            numberOfLines={1}
          >
            {memory.subtitle}
          </Text>
        </YStack>

        <XStack
          backgroundColor="#F3F4F6"
          paddingVertical={10}
          borderRadius={10}
          alignItems="center"
          justifyContent="center"
          gap={8}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={14}
            color="#4338CA"
          />
          <Text fontSize={12} color="#4338CA" fontWeight="700">
            Laisser un avis
          </Text>
        </XStack>
      </YStack>
    </YStack>
  );
}
