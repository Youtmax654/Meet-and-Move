import { useInbox } from "@/features/chat/inbox/hooks/use-inbox";
import { MessageInput } from "@/features/chat/thread/components/MessageInput";
import { MessageList } from "@/features/chat/thread/components/MessageList";
import { ThreadHeader } from "@/features/chat/thread/components/ThreadHeader";
import { useChatSse } from "@/features/chat/thread/hooks/use-chat-sse";
import { useThread } from "@/features/chat/thread/hooks/use-thread";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Platform } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { YStack } from "tamagui";

const CURRENT_USER_ID = "aaaa1111-aaaa-1111-aaaa-111111111111";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: messages, isLoading } = useThread(id!);
  const { sendMessage } = useChatSse(id!, CURRENT_USER_ID);

  const { data: inbox } = useInbox();
  const chatDetails = inbox?.find((chat) => chat.id === id);

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
          title={chatDetails?.title ?? "Chargement..."}
          subtitle={
            chatDetails?.type === "group"
              ? "Conversation de groupe"
              : "Message privé"
          }
        />

        <MessageList messages={messages ?? []} chatDetails={chatDetails} />

        <MessageInput onSend={sendMessage} />
      </YStack>
    </KeyboardAvoidingView>
  );
}
