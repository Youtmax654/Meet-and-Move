import { InboxHeader } from "@/features/chat/inbox/components/InboxHeader";
import { InboxList } from "@/features/chat/inbox/components/InboxList";
import { QuickFilters } from "@/features/chat/inbox/components/QuickFilters";
import { SearchBar } from "@/features/chat/inbox/components/SearchBar";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Circle, YStack } from "tamagui";

export default function ChatsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F6F5" }}>
      <YStack flex={1} gap="$4" backgroundColor="#F7F6F5">
        <InboxHeader />
        <SearchBar />
        <QuickFilters />

        <InboxList />

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
