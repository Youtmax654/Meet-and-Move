import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatSystemMessage } from "@/components/chat/ChatSystemMessage";
import { ExperienceWidget } from "@/components/chat/ExperienceWidget";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { Stack } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { YStack } from "tamagui";

export default function ChatScreen() {
  // Mock data representing the messages in the chat
  const messages = [
    {
      type: "system",
      id: "sys-1",
      text: "Aujourd'hui",
    },
    {
      type: "message",
      id: "msg-1",
      text: "Salut tout le monde ! Trop hâte pour la rando ce week-end. Est-ce que je dois prévoir des snacks en plus pour le groupe ? 🍏🥜",
      senderName: "Sarah Jenkins",
      timestamp: "09:12",
      isSelf: false,
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    {
      type: "message",
      id: "msg-2",
      text: "J'apporte mon réchaud portable si quelqu'un veut un café chaud au sommet ! ☕️",
      senderName: "Marcus Chen",
      timestamp: "09:15",
      isSelf: false,
      avatarUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
    {
      type: "message",
      id: "msg-3",
      text: "Ça a l'air génial Marcus ! Je ramène des cookies à l'avoine pour accompagner le café. Quelqu'un a besoin d'être récupéré à la gare ?",
      senderName: "Vous",
      timestamp: "09:16",
      isSelf: true,
      status: "Distribué",
    },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F7F6F5" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <YStack flex={1} backgroundColor="#F7F6F5">
        <ChatHeader
          title="Squad Randonnée Mont-Blanc"
          subtitle="Organisé par Julian • 12 membres en ligne"
        />

        <ScrollView contentContainerStyle={{ paddingBottom: 24, paddingTop: 16 }}>
          <ExperienceWidget
            status="Squad Actif"
            title="Sommet & Partage : Chamonix"
            date="Sam. 14 Oct. • 09:00"
          />

          <YStack marginTop="$4" gap="$2">
            {messages.map((msg) => {
              if (msg.type === "system") {
                return <ChatSystemMessage key={msg.id} text={msg.text!} />;
              }
              return (
                <MessageBubble
                  key={msg.id}
                  id={msg.id}
                  text={msg.text!}
                  senderName={msg.senderName}
                  timestamp={msg.timestamp!}
                  isSelf={msg.isSelf || false}
                  avatarUrl={msg.avatarUrl}
                  status={msg.status}
                />
              );
            })}
          </YStack>
        </ScrollView>

        <ChatInput />
      </YStack>
    </KeyboardAvoidingView>
  );
}
