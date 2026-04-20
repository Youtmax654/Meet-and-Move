import React, { useState } from "react";
import { Button, ScrollView, Text, XStack } from "tamagui";

const filters = ["Tous les messages", "Squads", "Individuels", "Unread"];

export function QuickFilters() {
  const [active, setActive] = useState("Tous les messages");

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} flexGrow={0}>
      <XStack gap="$3" paddingHorizontal="$4">
        {filters.map((filter) => {
          const isActive = active === filter;
          return (
            <Button
              key={filter}
              borderRadius="$10"
              size="$3"
              backgroundColor={isActive ? "#4953AC" : "#E2E2E1"}
              onPress={() => setActive(filter)}
              paddingHorizontal="$4"
              borderWidth={0}
              pressStyle={{ opacity: 0.8, borderWidth: 0 }}
            >
              <Text
                color={isActive ? "#F3F1FF" : "#5B5C5B"}
                fontWeight="500"
                fontSize="$3"
              >
                {filter}
              </Text>
            </Button>
          );
        })}
      </XStack>
    </ScrollView>
  );
}
