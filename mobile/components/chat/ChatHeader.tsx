import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, XStack, YStack } from "tamagui";

interface ChatHeaderProps {
  title: string;
  subtitle: string;
}

export function ChatHeader({ title, subtitle }: ChatHeaderProps) {
  const router = useRouter();

  return (
    <SafeAreaView edges={["top"]} style={{ backgroundColor: "#FFFFFF" }}>
      <XStack
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="$4"
        paddingVertical="$2"
        backgroundColor="#FFFFFF"
        borderBottomWidth={1}
        borderBottomColor="#F1F1F0"
      >
        <Button
          circular
          chromeless
          size="$3"
          icon={<Ionicons name="chevron-back" size={24} color="#000" />}
          onPress={() => router.back()}
        />

        <YStack flex={1} alignItems="center" paddingHorizontal="$2">
          <Text
            fontSize={16}
            fontWeight="700"
            color="#2E2F2F"
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text fontSize={12} color="#5B5C5B" numberOfLines={1}>
            {subtitle}
          </Text>
        </YStack>

        <Button
          circular
          chromeless
          size="$3"
          icon={<Ionicons name="ellipsis-horizontal" size={24} color="#000" />}
        />
      </XStack>
    </SafeAreaView>
  );
}
