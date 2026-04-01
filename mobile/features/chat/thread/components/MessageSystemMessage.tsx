import React from "react";
import { Text, XStack } from "tamagui";

interface MessageSystemMessageProps {
  text: string;
}

export function MessageSystemMessage({ text }: MessageSystemMessageProps) {
  return (
    <XStack
      justifyContent="center"
      alignItems="center"
      marginVertical="$3"
      alignSelf="center"
    >
      <XStack
        backgroundColor="rgba(226, 226, 225, 0.5)"
        borderRadius={9999}
        paddingHorizontal="$3"
        paddingVertical="$1"
      >
        <Text
          fontSize={11}
          fontWeight="500"
          color="#5B5C5B"
          textTransform="uppercase"
          letterSpacing={0.5}
        >
          {text}
        </Text>
      </XStack>
    </XStack>
  );
}
