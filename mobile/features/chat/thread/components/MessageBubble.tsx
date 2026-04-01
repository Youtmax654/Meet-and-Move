import React from "react";
import { Avatar, Text, XStack, YStack } from "tamagui";

interface MessageBubbleProps {
  id: string;
  text: string;
  senderName?: string;
  timestamp: string;
  isSelf: boolean;
  avatarUrl?: string;
  status?: string; // "delivered", "read"
}

export function MessageBubble({
  text,
  senderName,
  timestamp,
  isSelf,
  avatarUrl,
  status,
}: MessageBubbleProps) {
  return (
    <XStack
      gap="$3"
      alignSelf={isSelf ? "flex-end" : "flex-start"}
      flexDirection={isSelf ? "row-reverse" : "row"}
      maxWidth="85%"
      paddingHorizontal="$4"
      paddingVertical="$2"
    >
      {!isSelf && (
        <Avatar circular size="$3" backgroundColor="#DDDDDD">
          {avatarUrl && <Avatar.Image source={{ uri: avatarUrl }} />}
          <Avatar.Fallback backgroundColor="$gray5" />
        </Avatar>
      )}

      <YStack flexShrink={1}>
        {!isSelf && senderName && (
          <Text
            fontSize={11}
            fontWeight="600"
            color="#5B5C5B"
            marginLeft="$2"
            marginBottom="$1"
          >
            {senderName}
          </Text>
        )}

        <YStack
          backgroundColor={isSelf ? "#4953AC" : "#FFFFFF"}
          paddingHorizontal="$4"
          paddingVertical="$3"
          borderTopLeftRadius={16}
          borderTopRightRadius={16}
          borderBottomLeftRadius={isSelf ? 16 : 0}
          borderBottomRightRadius={isSelf ? 0 : 16}
          elevation={1}
          shadowColor="#000"
          shadowOpacity={0.05}
          shadowRadius={2}
          shadowOffset={{ width: 0, height: 1 }}
        >
          <Text
            fontSize={14}
            lineHeight={22}
            color={isSelf ? "#FFFFFF" : "#2E2F2F"}
          >
            {text}
          </Text>
        </YStack>

        <XStack
          marginTop="$1"
          alignItems="center"
          justifyContent={isSelf ? "flex-end" : "flex-start"}
          marginLeft={isSelf ? 0 : "$2"}
          marginRight={isSelf ? "$2" : 0}
          gap="$2"
        >
          {isSelf && status && (
            <Text fontSize={10} color="#5B5C5B">
              {status}
            </Text>
          )}
          <Text fontSize={10} color="#5B5C5B">
            {new Date(timestamp).toLocaleDateString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </XStack>
      </YStack>
    </XStack>
  );
}
