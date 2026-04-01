import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Button, Input, XStack } from "tamagui";

export function ChatInput() {
  return (
    <XStack
      paddingHorizontal="$3"
      paddingVertical="$3"
      backgroundColor="#F7F6F5"
      borderTopWidth={1}
      borderTopColor="#E2E2E1"
      gap="$2"
      alignItems="center"
    >
      <Button
        circular
        chromeless
        size="$3"
        icon={<Ionicons name="add" size={24} color="#5B5C5B" />}
      />

      <XStack
        flex={1}
        backgroundColor="#FFFFFF"
        borderRadius={9999}
        alignItems="center"
        paddingHorizontal="$2"
        elevation={1}
        shadowColor="#000"
        shadowOpacity={0.05}
        shadowRadius={2}
        shadowOffset={{ width: 0, height: 1 }}
      >
        <Input
          flex={1}
          height={40}
          borderWidth={0}
          backgroundColor="transparent"
          placeholder="Écrire un message..."
          placeholderTextColor={"#8C8D8C" as any}
          fontSize={14}
          color="#2E2F2F"
          focusStyle={{ outlineWidth: 0 }}
        />
        <Button
          circular
          chromeless
          size="$3"
          icon={<Ionicons name="happy-outline" size={20} color="#5B5C5B" />}
        />
      </XStack>

      <Button
        circular
        size="$3"
        backgroundColor="#006666"
        icon={<Ionicons name="mic-outline" size={20} color="#FFFFFF" />}
      />
    </XStack>
  );
}
