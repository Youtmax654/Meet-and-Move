import React from "react";
import { ScrollView, YStack } from "tamagui";
import { ThreadMessageJoined } from "../../shared/schemas/chat.schema";
import { ExperienceWidget } from "./ExperienceWidget";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: ThreadMessageJoined[];
}
export function MessageList({ messages }: MessageListProps) {
  return (
    <ScrollView
      flex={1}
      contentContainerStyle={{ paddingBottom: 24, paddingTop: 16 }}
    >
      <ExperienceWidget
        status="Squad Actif"
        title="Sommet & Partage : Chamonix"
        date="Sam. 14 Oct. • 09:00"
      />

      <YStack marginTop="$4" gap="$2">
        {messages.map((msg) => {
          // if (msg.type === "system") {
          //   return <MessageSystemMessage key={msg.id} text={msg.text} />;
          // }
          return (
            <MessageBubble
              key={msg.messages.id}
              id={msg.messages.id}
              text={msg.messages.content || ""}
              senderName={msg.users.username}
              timestamp={msg.messages.sentAt.toLocaleString() || ""}
              isSelf={false}
              avatarUrl={""}
              status={"delivered"}
            />
          );
        })}
      </YStack>
    </ScrollView>
  );
}
