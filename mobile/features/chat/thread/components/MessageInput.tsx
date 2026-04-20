import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input, XStack } from "tamagui";

interface MessageInputProps {
  onSend?: (content: string) => void;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (trimmed.length === 0) return;

    onSend?.(trimmed);
    setText("");
  };

  return (
    <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "#F7F6F5" }}>
      <XStack
        paddingHorizontal="$3"
        paddingTop="$4"
        paddingBottom="$2"
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
            placeholderTextColor="$gray8"
            fontSize={14}
            color="#2E2F2F"
            focusStyle={{ outlineWidth: 0 }}
            value={text}
            onChangeText={setText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
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
          backgroundColor={text.length > 0 ? "#4953AC" : "#006666"}
          icon={
            <Ionicons
              name={text.length > 0 ? "send" : "mic-outline"}
              size={20}
              color="#FFFFFF"
            />
          }
          onPress={handleSend}
        />
      </XStack>
    </SafeAreaView>
  );
}
