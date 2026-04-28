import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Button, Text, XStack, YStack } from "tamagui";

export function CreateActivityHeader() {
  const router = useRouter();

  return (
    <XStack alignItems="center" justifyContent="space-between">
      <Button
        circular
        chromeless
        size="$3"
        icon={<Ionicons name="chevron-back" size={24} color="#000" />}
        onPress={() => router.back()}
      />
      <Text fontSize={18} fontWeight="700" color="#1E2228">
        Nouvelle activité
      </Text>
      <YStack width={40} height={40} />
    </XStack>
  );
}
