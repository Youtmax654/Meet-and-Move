import React from "react";
import { Text, YStack } from "tamagui";

export function InboxHeader() {
  return (
    <YStack paddingHorizontal="$4">
      <Text fontSize="$8" fontWeight="bold" color="$color">
        Chats
      </Text>
    </YStack>
  );
}
