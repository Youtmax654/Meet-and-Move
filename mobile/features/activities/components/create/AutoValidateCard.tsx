import React from "react";
import { Switch, Text, XStack, YStack } from "tamagui";

type AutoValidateCardProps = {
  autoValidate: boolean;
  onAutoValidateChange: (value: boolean) => void;
};

export function AutoValidateCard({
  autoValidate,
  onAutoValidateChange,
}: AutoValidateCardProps) {
  return (
    <YStack
      backgroundColor="#FFFFFF"
      borderRadius={18}
      padding={14}
      borderWidth={1}
      borderColor="#EFEFED"
    >
      <XStack alignItems="center" justifyContent="space-between">
        <YStack gap={4} flex={1} paddingRight={12}>
          <Text fontSize={14} fontWeight="700" color="#1E2228">
            Validation automatique
          </Text>
          <Text fontSize={12} color="#5B5C5B">
            Les participants sont acceptes immédiatement.
          </Text>
        </YStack>
        <Switch
          checked={autoValidate}
          onCheckedChange={onAutoValidateChange}
          backgroundColor={autoValidate ? "#006666" : "#CFCFCD"}
        >
          <Switch.Thumb backgroundColor="#FFFFFF" />
        </Switch>
      </XStack>
    </YStack>
  );
}
