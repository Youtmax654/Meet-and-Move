import React from 'react';
import { XStack, Input } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

export function SearchBar() {
  return (
    <XStack
      backgroundColor="#F1F1F0"
      borderRadius="$4"
      paddingHorizontal="$3"
      alignItems="center"
      marginHorizontal="$4"
      height={48}
    >
      <Ionicons name="search" size={20} color="#ADADAC" />
      <Input
        flex={1}
        backgroundColor="transparent"
        borderWidth={0}
        color="#000"
        placeholder="Search chats or squads..."
        placeholderTextColor="$gray8"
        focusStyle={{ borderWidth: 0, outlineWidth: 0 }}
      />
    </XStack>
  );
}
