import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Button, Image, Text, XStack, YStack } from "tamagui";

interface ExperienceWidgetProps {
  status: string;
  title: string;
  date: string;
  onPressDetails?: () => void;
}

export function ExperienceWidget({
  status,
  title,
  date,
  onPressDetails,
}: ExperienceWidgetProps) {
  return (
    <XStack
      marginHorizontal="$4"
      marginTop="$4"
      backgroundColor="#F1F1F0"
      borderRadius={12}
      padding="$3"
      alignItems="center"
      justifyContent="space-between"
    >
      <XStack gap="$3" alignItems="center" flex={1}>
        {/* Placeholder for Experience Image */}
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=200&fit=crop",
          }}
          width={48}
          height={48}
          borderRadius={8}
          backgroundColor="#DDDDDD"
        />

        <YStack flex={1} gap="$1">
          <Text
            fontSize={10}
            fontWeight="700"
            color="#4953AC"
            textTransform="uppercase"
            letterSpacing={0.5}
          >
            {status}
          </Text>
          <Text fontSize={14} fontWeight="700" color="#2E2F2F" numberOfLines={1}>
            {title}
          </Text>
          <XStack alignItems="center" gap="$1.5">
            <Ionicons name="calendar-outline" size={12} color="#5B5C5B" />
            <Text fontSize={12} color="#5B5C5B">
              {date}
            </Text>
          </XStack>
        </YStack>
      </XStack>

      <Button
        backgroundColor="#006666"
        borderRadius={9999}
        size="$3"
        onPress={onPressDetails}
      >
        <Text color="#BBFFFE" fontWeight="bold">
          Voir détails
        </Text>
      </Button>
    </XStack>
  );
}
