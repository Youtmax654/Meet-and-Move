import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator } from "react-native";
import { ScrollView, Text, YStack } from "tamagui";
import { type Chat } from "../../shared/schemas/chat.schema";
import { useInbox } from "../hooks/use-inbox";
import { InboxItem } from "./InboxItem";

function chatTypeLabel(type: Chat["type"]): string {
  return type === "group" ? "Groupe" : "Privé";
}

export function InboxList() {
  const router = useRouter();
  const { data: chats, isLoading, isError, error } = useInbox();

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" color="#4953AC" />
      </YStack>
    );
  }

  if (isError) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" padding="$4">
        <Text color="#E53E3E" textAlign="center">
          Impossible de charger les conversations.{"\n"}
          {error?.message}
        </Text>
      </YStack>
    );
  }

  if (!chats || chats.length === 0) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" padding="$4">
        <Text color="#888" textAlign="center">
          Aucune conversation pour le moment.
        </Text>
      </YStack>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      flex={1}
      paddingHorizontal="$4"
    >
      <YStack gap="$4">
        {chats.map((chat) => (
          <InboxItem
            key={chat.id}
            item={{
              id: chat.id,
              type: chat.type === "group" ? "squad" : "individual",
              name: chatTypeLabel(chat.type),
              message: chat.activityId
                ? `Activité liée : ${chat.activityId}`
                : "Pas d'activité liée",
              time: new Date(chat.createdAt).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
              }),
              unreadCount: 0,
              online: false,
              archived: false,
            }}
            onPress={() => router.push(`/chat/${chat.id}`)}
          />
        ))}
      </YStack>
    </ScrollView>
  );
}
