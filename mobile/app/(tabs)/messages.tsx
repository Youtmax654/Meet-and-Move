import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, YStack } from "tamagui";

export default function MessagesScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F6F5" }}>
      <YStack
        flex={1}
        gap="$4"
        backgroundColor="#F7F6F5"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="$6" fontWeight="bold">
          Messages
        </Text>
      </YStack>
    </SafeAreaView>
  );
}
