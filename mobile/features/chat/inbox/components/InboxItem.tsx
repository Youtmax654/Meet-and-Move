import React from "react";
import { Avatar, Circle, Text, XStack, YStack } from "tamagui";

export type InboxItemData = {
  id: string;
  type: "squad" | "individual";
  name: string;
  message: string;
  time: string;
  unreadCount: number;
  online: boolean;
  archived: boolean;
  avatarUrl?: string;
};

export function InboxItem({
  item,
  onPress,
}: {
  item: InboxItemData;
  onPress?: () => void;
}) {
  const activityImageUri = `${process.env.EXPO_PUBLIC_API_URL}/activities/${item.id}/image`;

  return (
    <XStack
      padding="$3"
      gap="$3"
      backgroundColor={item.unreadCount > 0 ? "#FFFFFF" : "#F1F1F0"}
      borderRadius="$4"
      alignItems="center"
      opacity={item.archived ? 0.6 : 1}
      shadowColor="#000"
      shadowOpacity={item.unreadCount > 0 ? 0.05 : 0}
      shadowRadius={item.unreadCount > 0 ? 2 : 0}
      shadowOffset={{ width: 0, height: 1 }}
      onPress={onPress}
      pressStyle={{ opacity: 0.8 }}
    >
      <YStack>
        <Avatar circular size="$5">
          <Avatar.Image src={activityImageUri} />
          <Avatar.Fallback backgroundColor="$gray5" />
        </Avatar>
        {item.online && (
          <Circle
            size={12}
            backgroundColor="#4CAF50"
            position="absolute"
            bottom={0}
            right={0}
            borderWidth={2}
            borderColor="$background"
          />
        )}
      </YStack>

      <YStack flex={1} gap="$1">
        <XStack justifyContent="space-between" alignItems="center">
          <Text
            fontWeight={item.unreadCount > 0 ? "700" : "600"}
            fontSize="$4"
            color="#111"
            numberOfLines={1}
            flex={1}
          >
            {item.name}
          </Text>
          <Text
            fontSize="$2"
            color={item.unreadCount > 0 ? "#4953AC" : "#888"}
            fontWeight={item.unreadCount > 0 ? "600" : "400"}
          >
            {item.time}
          </Text>
        </XStack>

        <XStack justifyContent="space-between" alignItems="center">
          <Text
            color="#5B5C5B"
            fontSize="$3"
            numberOfLines={2}
            flex={1}
            fontWeight={item.unreadCount > 0 ? "500" : "400"}
          >
            {item.message}
          </Text>
          {item.unreadCount > 0 && (
            <Circle size={20} backgroundColor="#4953AC" marginLeft="$2">
              <Text color="#FFF" fontSize={10} fontWeight="bold">
                {item.unreadCount}
              </Text>
            </Circle>
          )}
        </XStack>
      </YStack>
    </XStack>
  );
}
