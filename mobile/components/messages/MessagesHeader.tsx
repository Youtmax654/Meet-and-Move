import React from "react";
import { Text, YStack } from "tamagui";

export function MessagesHeader() {
  return (
    <YStack paddingHorizontal="$4">
      <Text fontSize="$8" fontWeight="bold" color="$color">
        Messages
      </Text>
    </YStack>
  );
}
