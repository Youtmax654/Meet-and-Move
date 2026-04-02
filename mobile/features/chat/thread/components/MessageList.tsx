import React, { useRef } from "react";
import { ScrollView, YStack } from "tamagui";
import { Message } from "../../shared/schemas/chat.schema";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
}
export function MessageList({ messages }: MessageListProps) {
  const scrollViewRef = useRef<any>(null);

  return (
    <ScrollView
      flex={1}
      ref={scrollViewRef}
      onContentSizeChange={() =>
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }
    >
      <YStack marginTop="$4" gap="$2">
        {messages.map((msg) => {
          // if (msg.type === "system") {
          //   return <MessageSystemMessage key={msg.id} text={msg.text} />;
          // }
          return (
            <MessageBubble
              key={msg.id}
              id={msg.id}
              text={msg.content || ""}
              senderName={msg.senderUsername}
              timestamp={msg.sentAt.toLocaleString() || ""}
              isSelf={!!msg.isSelfMessage}
              avatarUrl={""}
            />
          );
        })}
      </YStack>
    </ScrollView>
  );
}
