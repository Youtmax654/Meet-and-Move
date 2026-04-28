import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, YStack } from "tamagui";

export function CreateActivityHero() {
  return (
    <YStack
      backgroundColor="#FFFFFF"
      borderRadius={20}
      padding={16}
      gap={12}
      borderWidth={1}
      borderColor="#EFEFED"
    >
      <Text fontSize={22} fontWeight="800" color="#1E2228">
        Cree ton experience
      </Text>
      <Text fontSize={13} color="#5B5C5B">
        Donne envie a la communaute en soignant le titre, la date et le lieu.
      </Text>
      <YStack
        height={150}
        borderRadius={16}
        backgroundColor="#EDECEA"
        alignItems="center"
        justifyContent="center"
        gap={8}
      >
        <Ionicons name="image" size={28} color="#9B9B9A" />
        <Text fontSize={12} color="#6B727B">
          Ajouter une photo de couverture
        </Text>
      </YStack>
    </YStack>
  );
}
