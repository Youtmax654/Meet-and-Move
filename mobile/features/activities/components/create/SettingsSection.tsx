import React from "react";
import { Button, Input, Text, XStack, YStack } from "tamagui";

type SettingsSectionProps = {
  duration: string;
  price: string;
  maxParticipants: string;
  difficultyOptions: readonly string[];
  difficulty: string;
  onDurationChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onMaxParticipantsChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
};

export function SettingsSection({
  duration,
  price,
  maxParticipants,
  difficultyOptions,
  difficulty,
  onDurationChange,
  onPriceChange,
  onMaxParticipantsChange,
  onDifficultyChange,
}: SettingsSectionProps) {
  return (
    <YStack gap={12}>
      <Text fontSize={16} fontWeight="700" color="#1E2228">
        Parametres
      </Text>
      <XStack gap={12} flexWrap="wrap">
        <YStack flex={1} minWidth={150} gap={6}>
          <Text fontSize={12} color="#6B727B">
            Duree (heures)
          </Text>
          <Input
            value={duration}
            onChangeText={onDurationChange}
            placeholder="Ex: 3"
            keyboardType="numeric"
            backgroundColor="#FFFFFF"
            borderColor="#E5E5E3"
            focusStyle={{ borderColor: "#006666" }}
          />
        </YStack>
        <YStack flex={1} minWidth={150} gap={6}>
          <Text fontSize={12} color="#6B727B">
            Prix (EUR)
          </Text>
          <Input
            value={price}
            onChangeText={onPriceChange}
            placeholder="Ex: 25"
            keyboardType="numeric"
            backgroundColor="#FFFFFF"
            borderColor="#E5E5E3"
            focusStyle={{ borderColor: "#006666" }}
          />
        </YStack>
      </XStack>
      <XStack gap={12} flexWrap="wrap">
        <YStack flex={1} minWidth={150} gap={6}>
          <Text fontSize={12} color="#6B727B">
            Participants max
          </Text>
          <Input
            value={maxParticipants}
            onChangeText={onMaxParticipantsChange}
            placeholder="Ex: 12"
            keyboardType="numeric"
            backgroundColor="#FFFFFF"
            borderColor="#E5E5E3"
            focusStyle={{ borderColor: "#006666" }}
          />
        </YStack>
        <YStack flex={1} minWidth={150} gap={6}>
          <Text fontSize={12} color="#6B727B">
            Niveau
          </Text>
          <XStack gap={8} flexWrap="wrap">
            {difficultyOptions.map((option) => {
              const isActive = difficulty === option;
              return (
                <Button
                  key={option}
                  height={36}
                  borderRadius={12}
                  paddingHorizontal={12}
                  backgroundColor={isActive ? "#4953AC" : "#F1F1F0"}
                  borderWidth={1}
                  borderColor={isActive ? "#4953AC" : "#E2E2E1"}
                  onPress={() => onDifficultyChange(option)}
                >
                  <Text
                    fontSize={12}
                    fontWeight="700"
                    color={isActive ? "#FFFFFF" : "#2E2F2F"}
                  >
                    {option}
                  </Text>
                </Button>
              );
            })}
          </XStack>
        </YStack>
      </XStack>
    </YStack>
  );
}
