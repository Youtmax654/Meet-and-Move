import React from "react";
import { Button, ScrollView, Text, XStack } from "tamagui";

export const CHAT_FILTERS = ["Tous les messages", "Squads", "Individuels"] as const;
export type ChatFilter = (typeof CHAT_FILTERS)[number];

type QuickFiltersProps = {
  active: ChatFilter;
  onActiveChange: (filter: ChatFilter) => void;
};

export function QuickFilters({ active, onActiveChange }: QuickFiltersProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} flexGrow={0}>
      <XStack gap="$3" paddingHorizontal="$4">
        {CHAT_FILTERS.map((filter) => {
          const isActive = active === filter;
          return (
            <Button
              key={filter}
              borderRadius="$10"
              size="$3"
              backgroundColor={isActive ? "#4953AC" : "#E2E2E1"}
              onPress={() => onActiveChange(filter)}
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
