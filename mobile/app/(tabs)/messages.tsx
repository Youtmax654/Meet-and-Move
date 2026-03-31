import { MessagesHeader } from "@/components/messages/MessagesHeader";
import { MessagesList } from "@/components/messages/MessagesList";
import { QuickFilters } from "@/components/messages/QuickFilters";
import { SearchBar } from "@/components/messages/SearchBar";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Circle, YStack } from "tamagui";

export default function MessagesScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F6F5" }}>
      <YStack flex={1} gap="$4" backgroundColor="#F7F6F5">
        <MessagesHeader />
        <SearchBar />
        <QuickFilters />

        <MessagesList />

        {/* Floating Action Button */}
        <Circle
          position="absolute"
          bottom={96}
          right={24}
          size={56}
          backgroundColor="#4953AC"
          elevation={5}
          shadowColor="#000"
          shadowOpacity={0.2}
          shadowRadius={5}
          shadowOffset={{ width: 0, height: 2 }}
          pressStyle={{ scale: 0.95 }}
        >
          <Ionicons name="chatbubble-ellipses" size={24} color="#FFF" />
        </Circle>
      </YStack>
    </SafeAreaView>
  );
}
