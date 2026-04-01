import { MessageInput } from "@/features/chat/thread/components/MessageInput";
import { MessageList } from "@/features/chat/thread/components/MessageList";
import { ThreadHeader } from "@/features/chat/thread/components/ThreadHeader";
import { useThread } from "@/features/chat/thread/hooks/use-thread";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Platform } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { YStack } from "tamagui";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: messages, isLoading } = useThread(id!);

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" color="#4953AC" />
      </YStack>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F7F6F5" }}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <YStack flex={1} backgroundColor="#F7F6F5">
        <ThreadHeader
          title="Squad Randonnée Mont-Blanc"
          subtitle="Organisé par Julian • 12 membres en ligne"
        />

        <MessageList messages={messages} />

        <MessageInput />
      </YStack>
    </KeyboardAvoidingView>
  );
}
