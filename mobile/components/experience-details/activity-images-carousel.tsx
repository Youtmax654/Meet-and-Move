import { Image } from "expo-image";
import { ScrollView } from "react-native";
import { Text, View, YStack } from "tamagui";

import type { Activity } from "@/types/activity";

function unique(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

export function ActivityImagesCarousel({ activity }: { activity?: Activity }) {
  const images = unique([
    ...(activity?.photos ?? []),
    activity?.coverImage ?? null,
    activity?.image ?? null,
  ]);

  if (images.length <= 1) {
    return null;
  }

  return (
    <YStack mt={14} gap={8}>
      <Text fontSize={14} fontWeight="700" color="#2E2F2F">
        Photos de l’activité
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View flexDirection="row" gap={10} pr={4}>
          {images.map((uri) => (
            <View
              key={uri}
              width={120}
              height={84}
              borderRadius={10}
              overflow="hidden"
              borderWidth={1}
              borderColor="#E2E2E1"
              backgroundColor="#E2E2E1"
            >
              <Image source={{ uri }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
            </View>
          ))}
        </View>
      </ScrollView>
    </YStack>
  );
}

